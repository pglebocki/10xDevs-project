import { Octokit } from '@octokit/rest';
import { Repository, Developer, PullRequestData } from '@10xdevs/shared';
import NodeCache from 'node-cache';
import { RepositoryData } from '../types/models.js';
import dotenv from 'dotenv';

export class GitHubApiClient {
  private octokit: Octokit;
  private cache: NodeCache;
  
  constructor(token?: string) {
    dotenv.config();
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

  async getAllRepositories(repositoryData: RepositoryData[]): Promise<Repository[]> {
    const repositories: Repository[] = [];
    
    for (const repoData of repositoryData) {
      const repoDetails = await this.getRepositoryDetails(repoData.url);
      if (repoDetails) {
        repoDetails.id = repoData.id;
        repositories.push(repoDetails);
      }
    }
    
    return repositories;
  }

  async getDeveloperPullRequests(repoUrl: string, developerId: string): Promise<PullRequestData[]> {
    const cacheKey = `pr_${repoUrl}_${developerId}`;
    const cachedData = this.cache.get<PullRequestData[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      
      // First, find the developer's GitHub login from the ID
      const developers = await this.getRepositoryDevelopers(repoUrl);
      const developer = developers.find(dev => dev.id === developerId);
      
      if (!developer) {
        throw new Error(`Developer with ID ${developerId} not found in repository`);
      }
      
      // Fetch pull requests authored by the developer
      const pullRequestsResponse = await this.octokit.pulls.list({
        owner,
        repo,
        state: 'all',
        sort: 'created',
        direction: 'desc',
        per_page: 100
      });

      const pullRequests: PullRequestData[] = [];
      
      // Process each PR authored by the developer
      for (const pr of pullRequestsResponse.data) {
        if (pr.user && pr.user.id.toString() === developerId) {
          // Get PR reviews (contains approvals)
          const reviews = await this.octokit.pulls.listReviews({
            owner,
            repo,
            pull_number: pr.number
          });
          
          // Get PR comments
          const comments = await this.octokit.pulls.listReviewComments({
            owner,
            repo,
            pull_number: pr.number
          });
          
          // Get PR commits
          const commits = await this.octokit.pulls.listCommits({
            owner,
            repo,
            pull_number: pr.number
          });
          
          // Format the data
          const pullRequestData: PullRequestData = {
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state as 'open' | 'closed',
            merged: !!pr.merged_at,
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            closedAt: pr.closed_at,
            mergedAt: pr.merged_at,
            authorId: pr.user.id.toString(),
            authorLogin: pr.user.login,
            authorAvatarUrl: pr.user.avatar_url,
            url: pr.html_url,
            commentsTimeline: comments.data.map(comment => ({
              date: comment.created_at,
              authorId: comment.user?.id.toString() || '',
              authorLogin: comment.user?.login || ''
            })),
            approvalsTimeline: reviews.data
              .filter(review => review.state === 'APPROVED')
              .map(review => ({
                date: review.submitted_at || '',
                authorId: review.user?.id.toString() || '',
                authorLogin: review.user?.login || ''
              })),
            commitsTimeline: commits.data.map(commit => ({
              date: commit.commit.author?.date || '',
              message: commit.commit.message,
              authorId: commit.author?.id?.toString() || '',
              authorLogin: commit.author?.login || ''
            }))
          };
          
          pullRequests.push(pullRequestData);
        }
      }
      
      this.cache.set(cacheKey, pullRequests);
      return pullRequests;
    } catch (error) {
      console.error(`Failed to fetch pull requests for developer ${developerId} in ${repoUrl}:`, error);
      return [];
    }
  }
} 