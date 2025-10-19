"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
/**
 * Validation middleware factory
 * Creates a middleware that validates request data against a Zod schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate request body against schema
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Extract first error message from issues array
                const firstError = error.issues?.[0];
                const message = firstError?.message || 'バリデーションエラー';
                (0, response_1.sendError)(res, message, 400);
            }
            else {
                (0, response_1.sendError)(res, 'バリデーションエラー', 400);
            }
        }
    };
};
exports.validate = validate;
