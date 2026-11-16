// =============================================================================
// src/validators/authValidator.js — Zod validation schemas for auth endpoints
// =============================================================================

import { z } from 'zod';

/** POST /api/auth/login request body */
export const loginSchema = z.object({
  email:    z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
