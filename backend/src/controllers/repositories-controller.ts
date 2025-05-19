import { Request, Response } from 'express';
import { ApiService } from '../services/api-service.js';
import { ApiResponse } from '@10xdevs/shared';

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
} 