// frontend/src/hooks/useIncidents.js
// Wraps listIncidents with filter params and pagination state.

import { useFetch } from './useFetch.js';
import { listIncidents } from '../api/incidents.js';

/**
 * Fetches incidents filtered/paginated by params.
 * Re-fetches whenever params change.
 *
 * @param {object} params - { q, hazard_type, severity, status, page, limit, sort, order }
 * @returns {{ data, loading, error, refresh }}
 */
export function useIncidents(params = {}) {
  // Serialise params to a stable string so useFetch deps work correctly.
  const key = JSON.stringify(params);
  return useFetch(() => listIncidents(params), [key]);
}
