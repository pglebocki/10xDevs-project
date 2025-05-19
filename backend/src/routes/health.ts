import express from 'express';
import { ApiResponse } from '@10xdevs/shared';

const router = express.Router();

router.get('/', (req, res) => {
  const response: ApiResponse<{ status: string; message: string }> = {
    success: true,
    data: {
      status: 'ok',
      message: 'Server is running'
    },
    timestamp: new Date().toISOString()
  };
  res.status(200).json(response);
});

export default router; 