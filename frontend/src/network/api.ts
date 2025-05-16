import { Repository, Developer, ApiResponse } from '@10xdevs/shared';

const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Generic fetch function with error handling
 */
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown API error');
    }
    
    return result.data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Fetch all repositories from the API
 */
export async function fetchRepositories(): Promise<Repository[]> {
  return fetchFromApi<Repository[]>('/repositories');
}

/**
 * Fetch developers for a specific repository
 */
export async function fetchDevelopers(repositoryId: string): Promise<Developer[]> {
  return fetchFromApi<Developer[]>(`/repositories/${repositoryId}/developers`);
}

/**
 * Fetch a specific repository by ID
 */
export async function fetchRepositoryById(repositoryId: string): Promise<Repository> {
  return fetchFromApi<Repository>(`/repositories/${repositoryId}`);
} 