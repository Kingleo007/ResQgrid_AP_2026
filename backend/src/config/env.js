// =============================================================================
// src/config/env.js — Environment variables for ResQGrid backend
// Reads from .env file (via dotenv). Fails fast if required vars are missing.
// =============================================================================

import 'dotenv/config';

// Helper: throws if the env var is not set
function required(name) {
  const val = process.env[name];
  if (!val) throw new Error(`[config] Missing required env var: ${name}`);
  return val;
}

// Helper: returns the env var or a default value
function optional(name, defaultValue = '') {
  return process.env[name] ?? defaultValue;
}

export const config = Object.freeze({
  port:         parseInt(optional('PORT', '4000'), 10),
  databaseUrl:  required('DATABASE_URL'),
  jwtSecret:    required('JWT_SECRET'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '8h'),
  clientOrigin: optional('CLIENT_ORIGIN', 'http://localhost:5173'),
  nodeEnv:      optional('NODE_ENV', 'development'),
});
