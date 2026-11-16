// frontend/src/api/alerts.js
// Alerts API — list, map view, promote, dismiss.

import { get, post } from './client.js';

/**
 * List alerts with optional filter/pagination params.
 * @param {object} params - { status, source_key, page, limit }
 */
export const listAlerts = (params = {}) => get('/alerts', params);

/**
 * Get alerts with coordinates for map display.
 */
export const listAlertsForMap = () => get('/alerts/map');

/**
 * Promote an alert into a full incident.
 * @param {string} id - Alert UUID
 * @param {object} overrides - Optional incident field overrides
 */
export const promoteAlert = (id, overrides = {}) =>
  post(`/alerts/${id}/promote`, overrides);

/**
 * Dismiss an alert (mark as not actionable).
 * @param {string} id - Alert UUID
 * @param {string} reason
 */
export const dismissAlert = (id, reason) =>
  post(`/alerts/${id}/dismiss`, { reason });
