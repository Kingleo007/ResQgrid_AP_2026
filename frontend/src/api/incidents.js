// frontend/src/api/incidents.js
// Incident API — CRUD, status changes, notes, assignments.

import { get, post, patch, del } from './client.js';

/**
 * List incidents with optional filter/sort/pagination params.
 * @param {object} params - { q, hazard_type, severity, status, page, limit, sort, order }
 */
export const listIncidents = (params = {}) => get('/incidents', params);

/**
 * Get a single incident by ID.
 * @param {string} id - UUID
 */
export const getIncident = (id) => get(`/incidents/${id}`);

/**
 * Create a new incident.
 * @param {object} data - Incident fields
 */
export const createIncident = (data) => post('/incidents', data);

/**
 * Update incident fields (title, description, severity, location, etc.).
 * @param {string} id
 * @param {object} data - Partial incident fields
 */
export const updateIncident = (id, data) => patch(`/incidents/${id}`, data);

/**
 * Change an incident's workflow status.
 * @param {string} id
 * @param {{ status: string, message?: string }} data
 */
export const changeStatus = (id, data) => post(`/incidents/${id}/status`, data);

/**
 * Delete an incident (admin only).
 * @param {string} id
 */
export const deleteIncident = (id) => del(`/incidents/${id}`);

/**
 * List the activity timeline (updates) for an incident.
 * @param {string} id
 * @param {object} params - { page, limit }
 */
export const listUpdates = (id, params = {}) => get(`/incidents/${id}/updates`, params);

/**
 * Add a note to an incident's timeline.
 * @param {string} id
 * @param {string} message
 */
export const addNote = (id, message) => post(`/incidents/${id}/updates`, { kind: 'note', message });

/**
 * List teams assigned to an incident.
 * @param {string} id
 */
export const listAssignments = (id) => get(`/incidents/${id}/assignments`);

/**
 * Assign a team to an incident.
 * @param {string} id - Incident UUID
 * @param {{ team_id: string, role?: string }} data
 */
export const assignTeam = (id, data) => post(`/incidents/${id}/assignments`, data);
