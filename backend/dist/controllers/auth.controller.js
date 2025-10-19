"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailController = exports.registerSponsorController = exports.registerClientController = exports.verifyInviteCodeController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
/**
 * Controller for verifying invite code
 * POST /api/auth/verify-invite-code
 */
const verifyInviteCodeController = async (req, res, next) => {
    try {
        const { code } = req.body;
        // Call service layer to verify invite code
        const verificationData = await (0, auth_service_1.verifyInviteCode)(code);
        // Send success response
        (0, response_1.sendSuccess)(res, verificationData, 200);
    }
    catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};
exports.verifyInviteCodeController = verifyInviteCodeController;
/**
 * Controller for CLIENT registration
 * POST /api/auth/register/client
 */
const registerClientController = async (req, res, next) => {
    try {
        const { inviteCodeId, firstName, lastName, email, password } = req.body;
        // Call service layer to register client
        const registrationData = await (0, auth_service_1.registerClient)(inviteCodeId, firstName, lastName, email, password);
        // Send success response
        (0, response_1.sendSuccess)(res, registrationData, 201);
    }
    catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};
exports.registerClientController = registerClientController;
/**
 * Controller for SPONSOR registration
 * POST /api/auth/register/sponsor
 */
const registerSponsorController = async (req, res, next) => {
    try {
        const { inviteCodeId, businessName, firstName, lastName, email, password, businessDescription } = req.body;
        // Call service layer to register sponsor
        const registrationData = await (0, auth_service_1.registerSponsor)(inviteCodeId, businessName, firstName, lastName, email, password, businessDescription);
        // Send success response
        (0, response_1.sendSuccess)(res, registrationData, 201);
    }
    catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};
exports.registerSponsorController = registerSponsorController;
/**
 * Controller for email verification
 * GET /api/auth/verify-email?token=xxx
 */
const verifyEmailController = async (req, res, next) => {
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
        const verificationData = await (0, auth_service_1.verifyEmail)(token);
        // Send success response with JWT token
        (0, response_1.sendSuccess)(res, verificationData, 200);
    }
    catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};
exports.verifyEmailController = verifyEmailController;
