"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate JWT token for authenticated user
 */
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateToken = generateToken;
/**
 * Verify and decode JWT token
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('トークンの有効期限が切れています');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('無効なトークンです');
        }
        throw error;
    }
};
exports.verifyToken = verifyToken;
