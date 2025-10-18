import { Request, Response, NextFunction } from 'express';
import { verifyInviteCode } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { VerifyInviteCodeInput } from '../validators/auth.validator';

/**
 * Controller for verifying invite code
 * POST /api/auth/verify-invite-code
 */
export const verifyInviteCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.body as VerifyInviteCodeInput;

    // Call service layer to verify invite code
    const verificationData = await verifyInviteCode(code);

    // Send success response
    sendSuccess(res, verificationData, 200);
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};
