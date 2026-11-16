// frontend/src/api/auth.js
// Auth API — login, logout, current user.

import { post, get } from './client.js';

/**
 * Log in with email and password.
 * On success the server sets an httpOnly session cookie.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data: { user: object } }>}
 */
export const login = (email, password) => post('/auth/login', { email, password });

/**
 * Log out the current session (clears cookie server-side).
 * @returns {Promise<void>}
 */
export const logout = () => post('/auth/logout', {});

/**
 * Fetch the currently authenticated user profile.
 * Returns 401 if not authenticated.
 * @returns {Promise<{ data: { user: object } }>}
 */
export const me = () => get('/auth/me');
