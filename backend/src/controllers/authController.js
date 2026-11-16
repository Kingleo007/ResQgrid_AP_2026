// =============================================================================
// src/controllers/authController.js — Auth controller for ResQGrid
// Handles login (sets JWT cookie), logout (clears cookie), and /me.
// =============================================================================

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Cookie lives for 8 hours (in milliseconds)
const COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare the submitted password against the stored bcrypt hash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Create a JWT (JSON Web Token) with the user's info inside
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name }, // payload (data stored in token)
      config.jwtSecret,     // secret key used to sign — keep this private!
      { expiresIn: config.jwtExpiresIn }, // token expires after 8h
    );

    // 4. Send the JWT as an httpOnly cookie
    // httpOnly = JavaScript cannot read this cookie (protects against XSS attacks)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure:   config.nodeEnv === 'production', // only HTTPS in production
      maxAge:   COOKIE_MAX_AGE_MS,
    });

    logger.info('[auth] Login success', { userId: user.id });

    // 5. Return the user info (but NOT the token or password)
    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err); // pass to error handler
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------
export async function logout(req, res) {
  // Clear the cookie — browser will delete it
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  return res.status(200).json({ message: 'Logged out successfully' });
}

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
export async function me(req, res) {
  // req.user is set by the authenticate middleware
  return res.status(200).json({ user: req.user });
}
