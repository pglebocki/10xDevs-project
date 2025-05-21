import { Request, Response } from 'express';
import { ApiService } from '../services/api-service.js';
import { ApiResponse, PullRequestData } from '@10xdevs/shared';

export class RepositoriesController {
  private mainApiService: ApiService;
  
  constructor() {
    this.mainApiService = new ApiService();
  }
  
  getRepositories = async (req: Request, res: Response): Promise<void> => {
    try {
      const repositories = await this.mainApiService.getRepositories();
      const response: ApiResponse<typeof repositories> = {
        success: true,
        data: repositories,
        timestamp: new Date().toISOString()
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getRepositories controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch repositories',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  };

  getDevelopersFromRepository = async (req: Request, res: Response): Promise<void> => {
    try {
      const { repoId } = req.params;
      
      if (!repoId) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Repository ID is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }
      
      const developers = await this.mainApiService.getDevelopers(repoId);
      const response: ApiResponse<typeof developers> = {
        success: true,
        data: developers,
        timestamp: new Date().toISOString()
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getDevelopers controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch developers',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  };

  getDeveloperPullRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const { repoId, developerId } = req.params;
      
      if (!repoId || !developerId) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Repository ID and Developer ID are required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }
      
      const pullRequests = await this.mainApiService.getDeveloperPullRequests(repoId, developerId);
      const response: ApiResponse<PullRequestData[]> = {
        success: true,
        data: pullRequests,
        timestamp: new Date().toISOString()
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getDeveloperPullRequests controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pull requests',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  };
} 