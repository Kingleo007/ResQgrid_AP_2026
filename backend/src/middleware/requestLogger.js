// =============================================================================
// src/middleware/requestLogger.js — HTTP request logger middleware for ResQGrid
// Logs method, path, response status, and duration for every request.
// Cookie values are stripped from logs to prevent token leakage.
// =============================================================================

import { logger } from '../utils/logger.js';

/**
 * Express middleware that logs HTTP request details on response finish.
 */
export function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    const meta = {
      method:   req.method,
      path:     req.path,
      status:   res.statusCode,
      durationMs: duration,
    };
    // Log at warn level for 4xx/5xx, info for everything else
    if (res.statusCode >= 500) {
      logger.error('[http]', meta);
    } else if (res.statusCode >= 400) {
      logger.warn('[http]', meta);
    } else {
      logger.info('[http]', meta);
    }
  });

  next();
}
