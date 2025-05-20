import { GitHubApiClient } from '../client/github-api.js';
import { supportedRepositories } from '../config/repositories.js';
import { Repository, Developer } from '@10xdevs/shared';

export class ApiService {
  private githubApiService: GitHubApiClient;
  
  constructor(githubToken?: string) {
    this.githubApiService = new GitHubApiClient(githubToken);
  }

  async getRepositories(): Promise<Repository[]> {
    try {      
      // Fetch detailed repository information from GitHub API
      return await this.githubApiService.getAllRepositories(supportedRepositories);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  async getDevelopers(repositoryId: string): Promise<Developer[]> {
    try {
      // Find the repository by ID
      const repository = supportedRepositories.find(repo => repo.id === repositoryId);
      
      if (!repository) {
        throw new Error(`Repository with ID ${repositoryId} not found`);
      }
      
      // Fetch developers for the repository
      const developers = await this.githubApiService.getRepositoryDevelopers(repository.url);
      
      return developers;
    } catch (error) {
      console.error(`Error fetching developers for repository ${repositoryId}:`, error);
      throw error;
    }
  }
} 