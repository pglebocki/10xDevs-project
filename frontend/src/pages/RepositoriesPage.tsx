import React from 'react';
import { useRepository } from '../contexts/RepositoryContext';
import RepositoryCard from '../components/dashboard/RepositoryCard';

const RepositoriesPage: React.FC = () => {
  const { repositories, selectedRepository, selectRepository } = useRepository();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
        <p className="mt-1 text-gray-500">Select a repository to view developer activity and metrics</p>
      </div>
      
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
    </div>
  );
};

export default RepositoriesPage;