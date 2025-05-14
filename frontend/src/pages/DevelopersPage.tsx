import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useRepository } from '../contexts/RepositoryContext';
import DeveloperCard from '../components/dashboard/DeveloperCard';
import DeveloperFilter from '../components/dashboard/DeveloperFilter';
import Button from '../components/ui/Button';

const DevelopersPage: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const { 
    repositories, 
    selectRepository, 
    selectedRepository,
    filteredDevelopers,
    filterDevelopers
  } = useRepository();
  
  React.useEffect(() => {
    if (repoId) {
      selectRepository(repoId);
    }
  }, [repoId, selectRepository]);
  
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
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/repositories" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to repositories
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{selectedRepository.name} - Developers</h1>
        <p className="mt-1 text-gray-500">View and filter developers working on this repository</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DeveloperFilter onFilter={filterDevelopers} />
        
        <Link to={`/repositories/${repoId}/metrics/pr-timeline`}>
          <Button variant="primary">View Metrics</Button>
        </Link>
      </div>
      
      {filteredDevelopers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No developers found for this repository.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((developer) => (
            <DeveloperCard 
              key={developer.id} 
              developer={developer} 
              repoId={repoId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DevelopersPage;