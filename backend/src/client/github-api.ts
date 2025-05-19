import { Octokit } from '@octokit/rest';
import { Repository } from '@10xdevs/shared';
import NodeCache from 'node-cache';

export class GitHubApiClient {
  private octokit: Octokit;
  private cache: NodeCache;
  
  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN
    });
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
      
      const repoData = await this.octokit.repos.get({
        owner,
        repo
      });

      const languages = await this.octokit.repos.listLanguages({
        owner,
        repo
      });

      const primaryLanguage = Object.keys(languages.data).length > 0 
        ? Object.keys(languages.data)[0] 
        : '';

      const repository: Repository = {
        id: repoData.data.id.toString(),
        name: repoData.data.name,
        url: repoData.data.html_url,
        description: repoData.data.description || '',
        stars: repoData.data.stargazers_count,
        forks: repoData.data.forks_count,
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