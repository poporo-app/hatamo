"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
/**
 * Send a success response
 */
const sendSuccess = (res, data, statusCode = 200) => {
    const response = {
        status: 'success',
        data,
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
/**
 * Send an error response
 */
const sendError = (res, message, statusCode = 400) => {
    const response = {
        status: 'error',
        message,
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
