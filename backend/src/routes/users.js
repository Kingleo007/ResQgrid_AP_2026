// =============================================================================
// src/routes/users.js — User management routes
// POST /api/users — create a new user (requires login)
// =============================================================================

import { Router } from 'express';
import authenticate         from '../middleware/authenticate.js';
import { validate }         from '../middleware/validate.js';
import { createUserSchema } from '../validators/userValidator.js';
import * as userController  from '../controllers/userController.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createUserSchema), userController.create); // POST /api/users

export default router;
