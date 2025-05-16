import React, { createContext, useContext, useState, useEffect } from 'react';
import { Repository, Developer } from '@10xdevs/shared';
import { fetchRepositories, fetchDevelopers } from '../network/api';

interface RepositoryContextType {
  repositories: Repository[];
  developers: Developer[];
  selectedRepository: Repository | null;
  selectedMetricType: string;
  selectRepository: (repoId: string) => void;
  selectMetricType: (type: string) => void;
  filteredDevelopers: Developer[];
  filterDevelopers: (searchTerm: string) => void;
  loading: boolean;
  error: string | null;
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
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('pr-timeline');
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch repositories on component mount
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        const data = await fetchRepositories();
        setRepositories(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load repositories. Please try again later.');
        setLoading(false);
        console.error('Error fetching repositories:', err);
      }
    };

    loadRepositories();
  }, []);

  const selectRepository = async (repoId: string) => {
    const repo = repositories.find(r => r.id === repoId) || null;
    setSelectedRepository(repo);
    
    if (repo) {
      try {
        setLoading(true);
        const repoDevelopers = await fetchDevelopers(repoId);
        setDevelopers(repoDevelopers);
        setFilteredDevelopers(repoDevelopers);
        setLoading(false);
      } catch (err) {
        setError('Failed to load developers. Please try again later.');
        setLoading(false);
        console.error('Error fetching developers:', err);
      }
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
      filterDevelopers,
      loading,
      error
    }}>
      {children}
    </RepositoryContext.Provider>
  );
};