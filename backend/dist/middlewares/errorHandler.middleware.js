"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Check if it's an operational error
    if (err instanceof errors_1.AppError && err.isOperational) {
        (0, response_1.sendError)(res, err.message, err.statusCode);
        return;
    }
    // Log unexpected errors
    console.error('Unexpected Error:', err);
    // Send generic error response for unexpected errors
    (0, response_1.sendError)(res, 'サーバー内部エラーが発生しました', 500);
};
exports.errorHandler = errorHandler;
