import { Request, Response } from 'express';
import { HealthController } from '../health-controller';
import { ApiResponse } from '@10xdevs/shared';
import { createMockRequest, createMockResponse, expectApiResponse } from '../../__tests__/test-utils';

describe('HealthController', () => {
  let healthController: HealthController;
  let mockRequest: Request;
  let mockResponse: Response;

  beforeEach(() => {
    healthController = new HealthController();
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    
    // Mock Date.prototype.toISOString to get consistent timestamps
    jest.spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2024-01-01T00:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getHealth', () => {
    it('should return health status with success response', async () => {
      // Arrange
      const expectedResponse: ApiResponse<{ status: string; message: string }> = {
        success: true,
        data: {
          status: 'ok',
          message: 'Server is running'
        },
        timestamp: '2024-01-01T00:00:00.000Z'
      };

      // Act
      await healthController.getHealth(mockRequest, mockResponse);

      // Assert
      expectApiResponse(mockResponse, 200, expectedResponse);
    });

    it('should return correct data structure', async () => {
      // Act
      await healthController.getHealth(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'ok',
            message: 'Server is running'
          }),
          timestamp: expect.any(String)
        })
      );
    });

    it('should call status and json methods exactly once', async () => {
      // Act
      await healthController.getHealth(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });

    it('should always return status ok', async () => {
      // Act
      await healthController.getHealth(mockRequest, mockResponse);

      // Assert
      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.data.status).toBe('ok');
    });

    it('should include timestamp in ISO format', async () => {
      // Act
      await healthController.getHealth(mockRequest, mockResponse);

      // Assert
      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
}); 