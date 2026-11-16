// =============================================================================
// src/routes/auth.js — Auth routes
// POST /api/auth/login  — email + password → sets httpOnly cookie
// POST /api/auth/logout — clears the cookie
// GET  /api/auth/me     — returns current logged-in user (requires auth)
// =============================================================================

import { Router } from 'express';
import { validate }        from '../middleware/validate.js';
import authenticate        from '../middleware/authenticate.js';
import { loginSchema }     from '../validators/authValidator.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login',  validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me',      authenticate, authController.me);

export default router;
