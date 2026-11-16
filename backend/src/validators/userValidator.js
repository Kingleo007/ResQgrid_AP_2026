// =============================================================================
// src/validators/userValidator.js — Zod schema for creating a user
// =============================================================================

import { z } from 'zod';

// POST /api/users
export const createUserSchema = z.object({
  name:     z.string().min(1, 'Name is required').max(100),
  email:    z.string().email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
