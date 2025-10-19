import { Router } from 'express';
import {
  verifyInviteCodeController,
  registerClientController,
  registerSponsorController,
  verifyEmailController
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  verifyInviteCodeSchema,
  registerClientSchema,
  registerSponsorSchema
} from '../validators/auth.validator';

const router = Router();

/**
 * POST /api/auth/verify-invite-code
 * Verify an invite code
 */
router.post(
  '/verify-invite-code',
  validate(verifyInviteCodeSchema),
  verifyInviteCodeController
);

/**
 * POST /api/auth/register/client
 * Register a new CLIENT user
 */
router.post(
  '/register/client',
  validate(registerClientSchema),
  registerClientController
);

/**
 * POST /api/auth/register/sponsor
 * Register a new SPONSOR user
 */
router.post(
  '/register/sponsor',
  validate(registerSponsorSchema),
  registerSponsorController
);

/**
 * GET /api/auth/verify-email?token=xxx
 * Verify email address with token
 */
router.get(
  '/verify-email',
  verifyEmailController
);

export default router;
