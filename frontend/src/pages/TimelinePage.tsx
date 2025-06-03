import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, GitPullRequest, MessageSquare, GitCommit } from 'lucide-react';
import { useRepository } from '../contexts/RepositoryContext';
import PRTimelineChart from '../components/dashboard/PRTimelineChart';
import MetricTypeSwitcher from '../components/dashboard/MetricTypeSwitcher';
import Card, { CardContent } from '../components/ui/Card';
import { fetchDeveloperById, fetchDeveloperPullRequests } from '../network/api';
import { Developer, PullRequestData } from '@10xdevs/shared';

const EmptyMetricView: React.FC<{ metricName: string }> = ({ metricName }) => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{metricName}</h3>
      <p className="text-gray-500">
        To be implemented...
      </p>
    </div>
  );
};

const TimelinePage: React.FC = () => {
  const { repoId, developerId, metricType } = useParams<{ repoId: string; developerId: string; metricType: string }>();
  const { 
    selectRepository, 
    selectedRepository,
    selectMetricType,
    selectedMetricType,
  } = useRepository();
  
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (repoId) {
      selectRepository(repoId);
    }
    
    if (metricType) {
      selectMetricType(metricType);
    }
  }, [repoId, metricType, selectRepository, selectMetricType]);
  
  useEffect(() => {
    const loadData = async () => {
      if (!repoId || !developerId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Ładowanie danych dewelopera i PR równolegle
        const [developerData, pullRequestsData] = await Promise.all([
          fetchDeveloperById(repoId, developerId),
          fetchDeveloperPullRequests(repoId, developerId)
        ]);
        
        setDeveloper(developerData);
        setPullRequests(pullRequestsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [repoId, developerId]);
  
  if (!selectedRepository) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Repository not found.</p>
        <Link to="/repositories" className="text-blue-500 hover:underline mt-2 inline-block">
          Back to repositories
        </Link>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading developer data...</p>
      </div>
    );
  }
  
  if (error || !developer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || 'Developer not found'}</p>
        <Link to={`/repositories/${repoId}/developers`} className="text-blue-500 hover:underline mt-2 inline-block">
          Back to developers list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="mb-6">
        <Link 
          to={`/repositories/${repoId}/developers`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to developers
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={developer.avatarUrl} 
            alt={developer.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{developer.name}</h1>
            <p className="text-gray-500">{developer.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <GitPullRequest className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Pull Requests</span>
              </div>
              <span className="text-2xl font-semibold">{pullRequests.length}</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Comments</span>
              </div>
              <span className="text-2xl font-semibold">
                {pullRequests.reduce((total, pr) => total + pr.commentsTimeline.length, 0)}
              </span>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <GitCommit className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-gray-600">Commits</span>
              </div>
              <span className="text-2xl font-semibold">
                {pullRequests.reduce((total, pr) => total + pr.commitsTimeline.length, 0)}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-6">
        <MetricTypeSwitcher 
          repoId={repoId || ''} 
          developerId={developerId}
          selected={selectedMetricType} 
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-full overflow-hidden">
        {selectedMetricType === 'pr-timeline' ? (
          <PRTimelineChart data={pullRequests} />
        ) : selectedMetricType === 'code-frequency' ? (
          <EmptyMetricView metricName="Code Frequency" />
        ) : selectedMetricType === 'contribution-ratio' ? (
          <EmptyMetricView metricName="Contribution Ratio" />
        ) : selectedMetricType === 'developer-activity' ? (
          <EmptyMetricView metricName="Developer Activity" />
        ) : (
          <EmptyMetricView metricName="Unknown Metric" />
        )}
      </div>
    </div>
  );
};

export default TimelinePage;