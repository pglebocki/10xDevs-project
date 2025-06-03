import { Request, Response } from 'express';

/**
 * Creates a mock Express Response object with commonly used methods
 */
export const createMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Creates a mock Express Request object with optional properties
 */
export const createMockRequest = (options: Partial<Request> = {}): Request => {
  const req = {
    params: {},
    query: {},
    body: {},
    headers: {},
    ...options
  } as Request;
  return req;
};

/**
 * Helper to assert API response structure
 */
export const expectApiResponse = (
  mockResponse: Response,
  expectedStatus: number,
  expectedData: any
) => {
  expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
  expect(mockResponse.json).toHaveBeenCalledWith(expectedData);
}; 