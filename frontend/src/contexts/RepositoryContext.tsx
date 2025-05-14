import React, { createContext, useContext, useState } from 'react';
import { Repository, Developer, mockRepositories, mockDevelopers } from '../data/mockData';

interface RepositoryContextType {
  repositories: Repository[];
  developers: Developer[];
  selectedRepository: Repository | null;
  selectedMetricType: string;
  selectRepository: (repoId: string) => void;
  selectMetricType: (type: string) => void;
  filteredDevelopers: Developer[];
  filterDevelopers: (searchTerm: string) => void;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
};

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories] = useState<Repository[]>(mockRepositories);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('pr-timeline');
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([]);

  const selectRepository = (repoId: string) => {
    const repo = repositories.find(r => r.id === repoId) || null;
    setSelectedRepository(repo);
    
    if (repo) {
      // In a real app, this would fetch developers from an API
      const repoDevelopers = mockDevelopers.filter(dev => 
        dev.repositories.includes(repoId)
      );
      setDevelopers(repoDevelopers);
      setFilteredDevelopers(repoDevelopers);
    } else {
      setDevelopers([]);
      setFilteredDevelopers([]);
    }
  };

  const selectMetricType = (type: string) => {
    setSelectedMetricType(type);
  };

  const filterDevelopers = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredDevelopers(developers);
      return;
    }
    
    const filtered = developers.filter(
      dev => dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             dev.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevelopers(filtered);
  };

  return (
    <RepositoryContext.Provider value={{
      repositories,
      developers,
      selectedRepository,
      selectedMetricType,
      selectRepository,
      selectMetricType,
      filteredDevelopers,
      filterDevelopers
    }}>
      {children}
    </RepositoryContext.Provider>
  );
};