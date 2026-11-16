// =============================================================================
// src/middleware/authenticate.js — JWT authentication middleware for ResQGrid
// Reads JWT from httpOnly cookie named "token", verifies signature, and
// attaches the decoded user payload to req.user for downstream handlers.
// On failure, passes a 401 error to Express's error handler.
// =============================================================================

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Express middleware. Requires a valid JWT in the "token" cookie.
 * Sets req.user = { id, email, name, role } on success.
 */
export default function authenticate(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    const err = new Error('Authentication required');
    err.status = 401;
    err.code = 'NO_TOKEN';
    return next(err);
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      id:    payload.id,
      email: payload.email,
      name:  payload.name,
      role:  payload.role,
    };
    next();
  } catch (jwtErr) {
    const err = new Error('Invalid or expired token');
    err.status = 401;
    err.code = 'INVALID_TOKEN';
    return next(err);
  }
}
