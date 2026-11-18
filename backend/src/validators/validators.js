// Request body validation schemas for incidents and users.
import { z } from 'zod';

// alternative of zod
// if (typeof req.body.email !== 'string' || !req.body.email.includes('@')) {
  // return res.status(400).json({ message: 'A valid email is required' });
// }
// z.string().email()= value must be a string formatted like an email address

const HAZARD_TYPES = ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'other'];
const SEVERITIES = ['low', 'moderate', 'high', 'critical'];
const STATUSES = ['reported', 'active', 'contained', 'resolved', 'closed'];

// POST /api/incidents
export const createIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  hazardType: z.enum(HAZARD_TYPES),
  severity: z.enum(SEVERITIES),
  description: z.string().optional(),
  locationName: z.string().optional(),
});

// PUT /api/incidents/:id
export const updateIncidentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  hazardType: z.enum(HAZARD_TYPES).optional(),
  severity: z.enum(SEVERITIES).optional(),
  status: z.enum(STATUSES).optional(),
  description: z.string().optional(),
  locationName: z.string().optional(),
});

// POST /api/users
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
