import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useRepository } from '../contexts/RepositoryContext';
import DeveloperCard from '../components/dashboard/DeveloperCard';
import DeveloperFilter from '../components/dashboard/DeveloperFilter';
import Button from '../components/ui/Button';
import { Developer } from '@10xdevs/shared';
import { fetchDevelopers } from '../network/api';


// Extended developer interface with additional API fields
interface ExtendedDeveloper extends Developer {
  login?: string;
  contributions?: number;
}

const DevelopersPage: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const { repositories, selectRepository, selectedRepository } = useRepository();
  
  const [developers, setDevelopers] = useState<ExtendedDeveloper[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<ExtendedDeveloper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDevs = useCallback(async () => {
    if (!repoId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const developers = await fetchDevelopers(repoId);
      setDevelopers(developers);
      setFilteredDevelopers(developers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [repoId]);
  
  useEffect(() => {
    if (repoId) {
      selectRepository(repoId);
      fetchDevs();
    }
  }, [repoId, selectRepository, fetchDevs]);
  
  const filterDevelopers = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredDevelopers(developers);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = developers.filter(
      dev => 
        dev.name.toLowerCase().includes(lowerCaseSearch) || 
        (dev.login && dev.login.toLowerCase().includes(lowerCaseSearch)) ||
        (dev.role && dev.role.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredDevelopers(filtered);
  }, [developers]);
  
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
          <Button variant="primary">View Repository Metrics</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Loading developers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchDevs}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      ) : filteredDevelopers.length === 0 ? (
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