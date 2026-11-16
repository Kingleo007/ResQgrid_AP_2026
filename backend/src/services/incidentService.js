// =============================================================================
// src/services/incidentService.js — Incident business logic for ResQGrid
//
// Orchestrates database operations in Prisma transactions, enforces the
// incident state-machine, and writes audit trail updates alongside every mutation.
// =============================================================================

import { prisma } from '../db/prisma.js';
import * as incidentModel from '../models/incidentModel.js';
import * as incidentUpdateModel from '../models/incidentUpdateModel.js';

// ---------------------------------------------------------------------------
// Transaction helper — wraps Prisma interactive transaction
// ---------------------------------------------------------------------------

/**
 * Runs `fn(tx)` inside a Prisma interactive transaction (BEGIN/COMMIT/ROLLBACK).
 * Passes the Prisma transaction client so model calls can join the same transaction.
 *
 * @template T
 * @param {(tx: import('../generated/prisma/client.ts').PrismaClient) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTransaction(fn) {
  return prisma.$transaction(fn);
}

// ---------------------------------------------------------------------------
// Status transition map
// ---------------------------------------------------------------------------
const TRANSITIONS = {
  reported:   ['verified', 'closed'],
  verified:   ['responding', 'monitoring', 'closed'],
  responding: ['monitoring', 'resolved'],
  monitoring: ['responding', 'resolved'],
  resolved:   ['closed', 'monitoring'], // monitoring = reopen (admin only, enforced in controller)
  closed:     [],                        // Terminal state
};

// ---------------------------------------------------------------------------
// changeStatus
// ---------------------------------------------------------------------------

/**
 * Change the status of an incident with validation and audit trail.
 *
 * @param {string} incidentId
 * @param {{ status: string, message?: string }} payload
 * @param {{ id: string, name: string, role: string }} user
 * @returns {Promise<object>} Updated incident
 */
export async function changeStatus(incidentId, { status, message }, user) {
  const incident = await incidentModel.findById(incidentId);
  if (!incident) {
    const err = new Error(`Incident ${incidentId} not found`);
    err.status = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  const allowed = TRANSITIONS[incident.status] ?? [];
  if (!allowed.includes(status)) {
    const err = new Error(
      `Cannot transition from '${incident.status}' to '${status}'. ` +
      `Allowed: ${allowed.length ? allowed.join(', ') : 'none (terminal state)'}`
    );
    err.status = 422; err.code = 'INVALID_TRANSITION';
    throw err;
  }

  if (['resolved', 'closed'].includes(status) && (!message || !message.trim())) {
    const err = new Error(`A message is required when moving to '${status}'`);
    err.status = 400; err.code = 'MESSAGE_REQUIRED';
    throw err;
  }

  const updateMsg = message?.trim() || `Status changed from ${incident.status} to ${status}`;

  return withTransaction(async (tx) => {
    const updateData = { status };
    if (status === 'resolved') updateData.resolved_at = new Date().toISOString();

    const updated = await incidentModel.updateIncident(incidentId, updateData, tx);

    await incidentUpdateModel.createUpdate({
      incident_id: incidentId,
      author_id:   user.id,
      kind:        'status_change',
      from_value:  incident.status,
      to_value:    status,
      message:     updateMsg,
    }, tx);

    return updated;
  });
}

// ---------------------------------------------------------------------------
// createIncident
// ---------------------------------------------------------------------------

/**
 * Create a new incident and write the 'created' audit update in one transaction.
 *
 * @param {object} data - Validated incident fields
 * @param {{ id: string, name: string }} user
 * @returns {Promise<object>} Created incident
 */
export async function createIncident(data, user) {
  return withTransaction(async (tx) => {
    const incident = await incidentModel.createIncident(
      { ...data, created_by: user.id },
      tx,
    );

    await incidentUpdateModel.createUpdate({
      incident_id: incident.id,
      author_id:   user.id,
      kind:        'created',
      message:     `Incident created by ${user.name}`,
    }, tx);

    return incident;
  });
}

// ---------------------------------------------------------------------------
// updateIncidentFields
// ---------------------------------------------------------------------------

/**
 * Update an incident's fields; if severity changed, write a severity_change update.
 *
 * @param {string} id
 * @param {object} data - Partial incident fields
 * @param {{ id: string, name: string }} user
 * @returns {Promise<object>} Updated incident
 */
export async function updateIncidentFields(id, data, user) {
  const current = await incidentModel.findById(id);
  if (!current) {
    const err = new Error(`Incident ${id} not found`);
    err.status = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  return withTransaction(async (tx) => {
    const updated = await incidentModel.updateIncident(id, data, tx);

    if (data.severity && data.severity !== current.severity) {
      await incidentUpdateModel.createUpdate({
        incident_id: id,
        author_id:   user.id,
        kind:        'severity_change',
        from_value:  current.severity,
        to_value:    data.severity,
        message:     `Severity changed from ${current.severity} to ${data.severity} by ${user.name}`,
      }, tx);
    }

    return updated;
  });
}
