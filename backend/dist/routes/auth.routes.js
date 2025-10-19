"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/verify-invite-code
 * Verify an invite code
 */
router.post('/verify-invite-code', (0, validate_middleware_1.validate)(auth_validator_1.verifyInviteCodeSchema), auth_controller_1.verifyInviteCodeController);
/**
 * POST /api/auth/register/client
 * Register a new CLIENT user
 */
router.post('/register/client', (0, validate_middleware_1.validate)(auth_validator_1.registerClientSchema), auth_controller_1.registerClientController);
/**
 * POST /api/auth/register/sponsor
 * Register a new SPONSOR user
 */
router.post('/register/sponsor', (0, validate_middleware_1.validate)(auth_validator_1.registerSponsorSchema), auth_controller_1.registerSponsorController);
/**
 * GET /api/auth/verify-email?token=xxx
 * Verify email address with token
 */
router.get('/verify-email', auth_controller_1.verifyEmailController);
exports.default = router;
