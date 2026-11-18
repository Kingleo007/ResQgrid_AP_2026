import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // Determine HTTP status
  let status = err.status ?? err.statusCode ?? 500;

  // Map Zod errors that slip through (shouldn't happen with validate middleware)
  if (err.name === 'ZodError') status = 400;

  // Map JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') status = 401;

  // Log 5xx errors with full detail (never log to production stdout in 4xx — noise)
  if (status >= 500) {
    logger.error('[errorHandler] Internal server error', {
      method:  req.method,
      path:    req.path,
      status,
      message: err.message,
      stack:   config.nodeEnv !== 'production' ? err.stack : undefined,
    });
  }

  const body = {
    error: {
      code:    err.code ?? (status === 404 ? 'NOT_FOUND' : status >= 500 ? 'INTERNAL_ERROR' : 'ERROR'),
      message: err.message ?? 'An unexpected error occurred',
      // Only include details/stack in non-production environments
      ...(config.nodeEnv !== 'production' && err.details ? { details: err.details } : {}),
    },
  };

  res.status(status).json(body);
}
