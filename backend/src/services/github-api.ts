import { Repository } from '../data/repositories';
import NodeCache from 'node-cache';
import axios from 'axios';

export class GitHubApiService {
  private token: string | undefined;
  private cache: NodeCache;
  
  constructor(token?: string) {
    this.token = token || process.env.GITHUB_TOKEN;
    this.cache = new NodeCache({ stdTTL: 300 }); // 5-minute cache
  }

  private parseRepoUrl(url: string): { owner: string; repo: string } {
    // Extract owner and repo from GitHub URL
    // Example: https://github.com/company/test1 -> { owner: "company", repo: "test1" }
    const urlParts = url.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    return { owner, repo };
  }

  async getRepositoryDetails(repoUrl: string): Promise<Repository | null> {
    const cacheKey = `repo_${repoUrl}`;
    const cachedData = this.cache.get<Repository>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      
      // Use axios instead of Octokit
      const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: this.token ? {
          Authorization: `token ${this.token}`
        } : {}
      });
      
      const repoData = repoResponse.data;
      
      // Get languages
      const languagesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: this.token ? {
          Authorization: `token ${this.token}`
        } : {}
      });
      
      const languagesData = languagesResponse.data;
      const primaryLanguage = Object.keys(languagesData).length > 0 
        ? Object.keys(languagesData)[0] 
        : '';

      const repository: Repository = {
        id: repoData.id.toString(),
        name: repoData.name,
        url: repoData.html_url,
        description: repoData.description || '',
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: primaryLanguage
      };

      this.cache.set(cacheKey, repository);
      return repository;
    } catch (error) {
      console.error(`Failed to fetch repository details for ${repoUrl}:`, error);
      return null;
    }
  }

  async getAllRepositories(repoUrls: string[]): Promise<Repository[]> {
    const repositories: Repository[] = [];
    
    for (const url of repoUrls) {
      const repoDetails = await this.getRepositoryDetails(url);
      if (repoDetails) {
        repositories.push(repoDetails);
      }
    }
    
    return repositories;
  }
} 