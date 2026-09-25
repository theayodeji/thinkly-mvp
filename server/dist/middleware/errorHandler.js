import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log the raw error and stack trace
    logger.error(err.stack || err.message || err);
    // If it's a Zod validation error
    if (err instanceof ZodError) {
        logger.error(`Validation details: ${JSON.stringify(err.issues, null, 2)}`);
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.issues
        });
    }
    // If it's a Mongoose CastError (e.g. invalid object ID)
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new AppError(message, 400);
    }
    // If it's a Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }
    // If it's a Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new AppError(message, 400);
    }
    // If it's a Gemini API Quota error (429)
    if (err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota exceeded') || err.message.toLowerCase().includes('resource has been exhausted'))) {
        error = new AppError('AI provider quota exceeded. Please try again later.', 429);
    }
    const statusCode = error.statusCode || 500;
    if (config.NODE_ENV === 'development') {
        res.status(statusCode).json({
            error: error.message,
            stack: err.stack,
        });
    }
    else {
        // Production
        if (error.isOperational) {
            res.status(statusCode).json({
                error: error.message
            });
        }
        else {
            // Programming or other unknown error: don't leak error details
            res.status(500).json({
                error: 'Something went very wrong!'
            });
        }
    }
};
