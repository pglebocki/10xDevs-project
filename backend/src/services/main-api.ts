import { GitHubApiService } from './github-api';
import { mockRepositories, Repository } from '../data/repositories';

export class MainApiService {
  private githubApiService: GitHubApiService;
  
  constructor(githubToken?: string) {
    this.githubApiService = new GitHubApiService(githubToken);
  }

  async getRepositories(): Promise<Repository[]> {
    try {
      // Extract URLs from mockRepositories
      const repoUrls = mockRepositories.map(repo => repo.url);
      
      // Fetch detailed repository information from GitHub API
      const repositories = await this.githubApiService.getAllRepositories(repoUrls);
      
      return repositories;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }
} 