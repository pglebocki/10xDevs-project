import { Request, Response } from 'express';
import { MainApiService } from '../services/main-api.js';

export class RepositoriesController {
  private mainApiService: MainApiService;
  
  constructor() {
    this.mainApiService = new MainApiService();
  }
  
  getRepositories = async (req: Request, res: Response): Promise<void> => {
    try {
      const repositories = await this.mainApiService.getRepositories();
      res.status(200).json(repositories);
    } catch (error) {
      console.error('Error in getRepositories controller:', error);
      res.status(500).json({ 
        error: 'Failed to fetch repositories', 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 