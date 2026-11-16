// frontend/src/api/teams.js
// Teams API — list all teams.

import { get } from './client.js';

/**
 * List all teams (used for assignment dropdowns).
 * @param {object} params - { kind, available, page, limit }
 */
export const listTeams = (params = {}) => get('/teams', params);
