// =============================================================================
// src/controllers/incidentController.js — Incident CRUD for ResQGrid
// Each function handles one route. Reads input, calls the model, returns JSON.
// =============================================================================

import * as incidentModel from '../models/incidentModel.js';

// ---------------------------------------------------------------------------
// GET /api/incidents
// Returns all incidents (simple full list — no pagination for now)
// ---------------------------------------------------------------------------
export async function list(req, res, next) {
  try {
    const incidents = await incidentModel.listAll();
    return res.json(incidents);  // frontend expects a plain array
  } catch (err) { next(err); }
}

// ---------------------------------------------------------------------------
// GET /api/incidents/:id
// Returns one incident by ID
// ---------------------------------------------------------------------------
export async function getOne(req, res, next) {
  try {
    const incident = await incidentModel.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.json(incident);
  } catch (err) { next(err); }
}

// ---------------------------------------------------------------------------
// POST /api/incidents
// Creates a new incident
// ---------------------------------------------------------------------------
export async function create(req, res, next) {
  try {
    const incident = await incidentModel.createIncident(req.body);
    return res.status(201).json(incident);
  } catch (err) { next(err); }
}

// ---------------------------------------------------------------------------
// PUT /api/incidents/:id
// Updates fields of an existing incident (title, status, severity, etc.)
// ---------------------------------------------------------------------------
export async function update(req, res, next) {
  try {
    const incident = await incidentModel.updateIncident(req.params.id, req.body);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.json(incident);
  } catch (err) { next(err); }
}

// ---------------------------------------------------------------------------
// DELETE /api/incidents/:id
// Deletes an incident permanently
// ---------------------------------------------------------------------------
export async function remove(req, res, next) {
  try {
    const deleted = await incidentModel.deleteIncident(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.status(204).send(); // 204 = success, no content to return
  } catch (err) { next(err); }
}
