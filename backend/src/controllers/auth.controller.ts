import { Request, Response, NextFunction } from 'express';
import { verifyInviteCode, registerClient, registerSponsor, verifyEmail } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import {
  VerifyInviteCodeInput,
  RegisterClientInput,
  RegisterSponsorInput
} from '../validators/auth.validator';

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

/**
 * Controller for CLIENT registration
 * POST /api/auth/register/client
 */
export const registerClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { inviteCodeId, firstName, lastName, email, password } = req.body as RegisterClientInput;

    // Call service layer to register client
    const registrationData = await registerClient(
      inviteCodeId,
      firstName,
      lastName,
      email,
      password
    );

    // Send success response
    sendSuccess(res, registrationData, 201);
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * Controller for SPONSOR registration
 * POST /api/auth/register/sponsor
 */
export const registerSponsorController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      inviteCodeId,
      businessName,
      firstName,
      lastName,
      email,
      password,
      businessDescription
    } = req.body as RegisterSponsorInput;

    // Call service layer to register sponsor
    const registrationData = await registerSponsor(
      inviteCodeId,
      businessName,
      firstName,
      lastName,
      email,
      password,
      businessDescription
    );

    // Send success response
    sendSuccess(res, registrationData, 201);
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * Controller for email verification
 * GET /api/auth/verify-email?token=xxx
 */
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.query;

    // Validate token parameter
    if (!token || typeof token !== 'string') {
      res.status(400).json({
        status: 'error',
        message: '確認トークンが指定されていません',
      });
      return;
    }

    // Call service layer to verify email
    const verificationData = await verifyEmail(token);

    // Send success response with JWT token
    sendSuccess(res, verificationData, 200);
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};
