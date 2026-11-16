// =============================================================================
// src/validators/incidentValidator.js — Zod schemas for incident endpoints
// Zod validates the request body before it reaches the controller.
// =============================================================================

import { z } from 'zod';

const HAZARD_TYPES = ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'other'];
const SEVERITIES   = ['low', 'moderate', 'high', 'critical'];
const STATUSES     = ['reported', 'active', 'contained', 'resolved', 'closed'];

// POST /api/incidents — required fields to create an incident
export const createIncidentSchema = z.object({
  title:        z.string().min(1, 'Title is required').max(200),
  hazardType:   z.enum(HAZARD_TYPES),
  severity:     z.enum(SEVERITIES),
  description:  z.string().optional(),
  locationName: z.string().optional(),
});

// PUT /api/incidents/:id — all fields optional (partial update)
export const updateIncidentSchema = z.object({
  title:        z.string().min(1).max(200).optional(),
  hazardType:   z.enum(HAZARD_TYPES).optional(),
  severity:     z.enum(SEVERITIES).optional(),
  status:       z.enum(STATUSES).optional(),
  description:  z.string().optional(),
  locationName: z.string().optional(),
});
