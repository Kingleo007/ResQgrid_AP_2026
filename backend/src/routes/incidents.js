// =============================================================================
// src/routes/incidents.js — Incident routes
// All routes require authentication (checked via JWT cookie).
// GET    /api/incidents        — list all incidents
// POST   /api/incidents        — create a new incident
// GET    /api/incidents/:id    — get one incident
// PUT    /api/incidents/:id    — update an incident (title, status, etc.)
// DELETE /api/incidents/:id    — delete an incident
// =============================================================================

import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createIncidentSchema, updateIncidentSchema } from '../validators/incidentValidator.js';
import * as incidentController from '../controllers/incidentController.js';

const router = Router();

// Every incident route requires a valid login session
router.use(authenticate);

router.get('/',      incidentController.list);                            // GET  /api/incidents
router.post('/',     validate(createIncidentSchema), incidentController.create);  // POST /api/incidents
router.get('/:id',   incidentController.getOne);                          // GET  /api/incidents/:id
router.put('/:id',   validate(updateIncidentSchema), incidentController.update);  // PUT  /api/incidents/:id
router.delete('/:id', incidentController.remove);                         // DELETE /api/incidents/:id

export default router;
