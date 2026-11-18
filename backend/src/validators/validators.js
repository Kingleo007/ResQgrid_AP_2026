const HAZARD_TYPES = ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'other'];
const SEVERITIES = ['low', 'moderate', 'high', 'critical'];
const STATUSES = ['reported', 'active', 'contained', 'resolved', 'closed'];

// 1. POST /api/incidents
export function validateCreateIncident(body) {
  const { title, hazardType, severity, description, locationName } = body || {};

  if (!title || typeof title !== 'string' || title.length > 200) {
    return { valid: false, message: 'Title is required (max 200 characters)' };
  }

  if (!HAZARD_TYPES.includes(hazardType)) {
    return { valid: false, message: 'Invalid hazard type' };
  }

  if (!SEVERITIES.includes(severity)) {
    return { valid: false, message: 'Invalid severity level' };
  }

  // Optional fields: only check if the user actually sent them
  if (description !== undefined && typeof description !== 'string') {
    return { valid: false, message: 'Description must be text' };
  }

  if (locationName !== undefined && typeof locationName !== 'string') {
    return { valid: false, message: 'Location name must be text' };
  }

  return { valid: true };
}

// 2. PUT /api/incidents/:id (all fields are optional during update)
export function validateUpdateIncident(body) {
  const { title, hazardType, severity, status, description, locationName } = body || {};

  if (title !== undefined && (typeof title !== 'string' || title.length < 1 || title.length > 200)) {
    return { valid: false, message: 'Title must be 1–200 characters' };
  }

  if (hazardType !== undefined && !HAZARD_TYPES.includes(hazardType)) {
    return { valid: false, message: 'Invalid hazard type' };
  }

  if (severity !== undefined && !SEVERITIES.includes(severity)) {
    return { valid: false, message: 'Invalid severity level' };
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    return { valid: false, message: 'Invalid status' };
  }

  if (description !== undefined && typeof description !== 'string') {
    return { valid: false, message: 'Description must be text' };
  }

  if (locationName !== undefined && typeof locationName !== 'string') {
    return { valid: false, message: 'Location name must be text' };
  }

  return { valid: true };
}

// 3. POST /api/users
export function validateCreateUser(body) {
  const { name, email, password } = body || {};

  if (!name || typeof name !== 'string' || name.length > 100) {
    return { valid: false, message: 'Name is required (max 100 characters)' };
  }

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return { valid: false, message: 'Must be a valid email' };
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  return { valid: true };
}