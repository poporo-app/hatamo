import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if it's an operational error
  if (err instanceof AppError && err.isOperational) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Log unexpected errors
  console.error('Unexpected Error:', err);

  // Send generic error response for unexpected errors
  sendError(res, 'サーバー内部エラーが発生しました', 500);
};
