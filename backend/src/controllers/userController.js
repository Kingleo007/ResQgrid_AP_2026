// =============================================================================
// src/controllers/userController.js — User management for ResQGrid
// POST /api/users — create a new user (hashes password with bcrypt first)
// =============================================================================

import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';

// ---------------------------------------------------------------------------
// POST /api/users
// Body: { name, email, password }
// ---------------------------------------------------------------------------
export async function create(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Hash the plain password before storing — never save plain text!
    // saltRounds=10 is the standard balance of speed vs security
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({ name, email, passwordHash });
    return res.status(201).json(user);
  } catch (err) { next(err); }
}
