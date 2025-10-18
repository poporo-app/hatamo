import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

/**
 * Validation middleware factory
 * Creates a middleware that validates request data against a Zod schema
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body against schema
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract first error message from issues array
        const firstError = error.issues?.[0];
        const message = firstError?.message || 'バリデーションエラー';
        sendError(res, message, 400);
      } else {
        sendError(res, 'バリデーションエラー', 400);
      }
    }
  };
};
