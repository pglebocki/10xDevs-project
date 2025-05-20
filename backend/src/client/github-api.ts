import { Octokit } from '@octokit/rest';
import { Repository, Developer } from '@10xdevs/shared';
import NodeCache from 'node-cache';
import { RepositoryData } from '../types/repository_data.js';

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
        id: "",
        githubId: repoData.data.id.toString(),
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

  async getRepositoryDevelopers(repoUrl: string): Promise<Developer[]> {
    const cacheKey = `developers_${repoUrl}`;
    const cachedData = this.cache.get<Developer[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      
      // Fetch contributors from GitHub API
      const contributors = await this.octokit.repos.listContributors({
        owner,
        repo,
        per_page: 100 // Adjust as needed
      });

      // Transform contributors to Developer objects
      const developers: Developer[] = [];
      
      for (const contributor of contributors.data) {
        if (!contributor || !contributor.id || !contributor.login || !contributor.avatar_url) {
          continue; // Skip invalid contributors
        }
        
        try {
          // For each contributor, fetch user details
          const userDetails = await this.octokit.users.getByUsername({
            username: contributor.login
          });

          developers.push({
            id: contributor.id.toString(),
            name: userDetails.data.name || contributor.login,
            email: userDetails.data.email || '',
            avatarUrl: contributor.avatar_url,
            repositories: [repoUrl],
            role: 'Contributor' // Default role
          });
        } catch (error) {
          console.error(`Failed to fetch details for user ${contributor.login}:`, error);
          // Add minimal information if user details fetch fails
          developers.push({
            id: contributor.id.toString(),
            name: contributor.login,
            email: '',
            avatarUrl: contributor.avatar_url,
            repositories: [repoUrl],
            role: 'Contributor'
          });
        }
      }

      this.cache.set(cacheKey, developers);
      return developers;
    } catch (error) {
      console.error(`Failed to fetch developers for ${repoUrl}:`, error);
      return [];
    }
  }

  async getAllRepositories(repositoriesData: RepositoryData[]): Promise<Repository[]> {
    const repositories: Repository[] = [];
    
    for (const repoData of repositoriesData) {
      const repoDetails = await this.getRepositoryDetails(repoData.url);
      if (repoDetails) {
        repoDetails.id = repoData.id;
        repositories.push(repoDetails);
      }
    }
    
    return repositories;
  }
} 