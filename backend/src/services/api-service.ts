import { GitHubApiClient } from '../client/github-api.js';
import { supportedRepositories } from '../config/repositories.js';
import { Repository } from '@10xdevs/shared';

export class ApiService {
  private githubApiService: GitHubApiClient;
  
  constructor(githubToken?: string) {
    this.githubApiService = new GitHubApiClient(githubToken);
  }

  async getRepositories(): Promise<Repository[]> {
    try {
      // Extract URLs from mockRepositories
      const repoUrls = supportedRepositories.map(repo => repo.url);
      
      // Fetch detailed repository information from GitHub API
      const repositories = await this.githubApiService.getAllRepositories(repoUrls);
      
      return repositories;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }
} 