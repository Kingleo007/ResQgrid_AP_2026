// =============================================================================
// src/routes/dashboard.js — Dashboard route
// GET /api/dashboard — returns simple stats (total, active, resolved counts)
// =============================================================================

import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = Router();

// Require login to see the dashboard
router.use(authenticate);

// GET /api/dashboard
router.get('/', dashboardController.getStats);

export default router;
