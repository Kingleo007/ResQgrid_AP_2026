// =============================================================================
// src/routes/health.js — Health check route for ResQGrid
// GET /health — No authentication required; used by monitors and Docker
// =============================================================================

import { Router } from 'express';
import { health } from '../controllers/healthController.js';

const router = Router();

router.get('/', health);

export default router;
