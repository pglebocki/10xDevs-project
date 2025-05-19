import React from 'react';
import { useRepository } from '../contexts/RepositoryContext';
import RepositoryCard from '../components/dashboard/RepositoryCard';

const RepositoriesPage: React.FC = () => {
  const { repositories, selectedRepository, selectRepository, loading, error } = useRepository();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
        <p className="mt-1 text-gray-500">Select a repository to view developer activity and metrics</p>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-center mt-3 text-sm text-gray-500">Loading repositories...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && repositories.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
          <p>No repositories found.</p>
        </div>
      )}
      
      {!loading && repositories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <RepositoryCard 
              key={repo.id} 
              repository={repo}
              selected={selectedRepository?.id === repo.id}
              onSelect={selectRepository}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoriesPage;