import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '../types';

/**
 * Send a success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response => {
  const response: SuccessResponse<T> = {
    status: 'success',
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400
): Response => {
  const response: ErrorResponse = {
    status: 'error',
    message,
  };
  return res.status(statusCode).json(response);
};
