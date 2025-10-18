import { Router } from 'express';
import { verifyInviteCodeController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { verifyInviteCodeSchema } from '../validators/auth.validator';

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

export default router;
