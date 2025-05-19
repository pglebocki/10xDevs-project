import { ApiResponse } from '@10xdevs/shared';
import { Request, Response } from 'express';

export class HealthController {
  getHealth = async (req: Request, res: Response): Promise<void> => {
    const response: ApiResponse<{ status: string; message: string }> = {
        success: true,
        data: {
          status: 'ok',
          message: 'Server is running'
        },
        timestamp: new Date().toISOString()
      };
      res.status(200).json(response);
  };
}
