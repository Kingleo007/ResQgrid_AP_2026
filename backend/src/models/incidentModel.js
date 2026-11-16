// =============================================================================
// src/models/incidentModel.js — Incident database queries for ResQGrid (Prisma 7)
// Simple CRUD functions — each one does one thing and returns a plain object.
// =============================================================================

import { prisma } from '../db/prisma.js';

// ---------------------------------------------------------------------------
// Helper: generate an incident code like "INC-2026-0001"
// Called when creating a new incident
// ---------------------------------------------------------------------------
async function generateCode() {
  const year  = new Date().getFullYear();
  // Count how many incidents exist this year to build the sequence number
  const count = await prisma.incident.count({
    where: {
      incidentCode: { startsWith: `INC-${year}-` },
    },
  });
  const seq = String(count + 1).padStart(4, '0'); // e.g. "0001"
  return `INC-${year}-${seq}`;
}

// ---------------------------------------------------------------------------
// listAll
// Returns all incidents, newest first
// ---------------------------------------------------------------------------
export async function listAll() {
  const rows = await prisma.incident.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Map Prisma's camelCase fields to the shape the frontend expects
  return rows.map(toShape);
}

// ---------------------------------------------------------------------------
// findById
// Returns one incident by its UUID, or null if not found
// ---------------------------------------------------------------------------
export async function findById(id) {
  const inc = await prisma.incident.findFirst({ where: { id } });
  return toShape(inc);
}

// ---------------------------------------------------------------------------
// createIncident
// Creates a new row in the incidents table
// ---------------------------------------------------------------------------
export async function createIncident(data) {
  const { title, hazardType, severity, description, locationName } = data;

  const incidentCode = await generateCode();

  const inc = await prisma.incident.create({
    data: {
      incidentCode,
      title,
      hazardType,
      severity,
      status:       'reported', // all new incidents start as "reported"
      description:  description  || null,
      locationName: locationName || null,
    },
  });

  return toShape(inc);
}

// ---------------------------------------------------------------------------
// updateIncident
// Updates fields of an existing incident (partial update — only send what changed)
// ---------------------------------------------------------------------------
export async function updateIncident(id, data) {
  // Build the data object — only include fields that were actually sent
  const update = {};
  if (data.title        !== undefined) update.title        = data.title;
  if (data.hazardType   !== undefined) update.hazardType   = data.hazardType;
  if (data.severity     !== undefined) update.severity     = data.severity;
  if (data.status       !== undefined) update.status       = data.status;
  if (data.description  !== undefined) update.description  = data.description;
  if (data.locationName !== undefined) update.locationName = data.locationName;

  // If nothing to update, just return current record
  if (Object.keys(update).length === 0) return findById(id);

  try {
    const inc = await prisma.incident.update({
      where: { id },
      data:  update,
    });
    return toShape(inc);
  } catch (err) {
    // Prisma throws P2025 when the record doesn't exist
    if (err.code === 'P2025') return null;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// deleteIncident
// Deletes an incident by ID. Returns true if deleted, false if not found.
// ---------------------------------------------------------------------------
export async function deleteIncident(id) {
  try {
    await prisma.incident.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false; // not found
    throw err;
  }
}

// ---------------------------------------------------------------------------
// toShape — convert Prisma camelCase object to the shape the frontend expects
// The frontend uses camelCase (incidentCode, hazardType, locationName etc.)
// ---------------------------------------------------------------------------
function toShape(inc) {
  if (!inc) return null;
  return {
    id:           inc.id,
    incidentCode: inc.incidentCode,
    title:        inc.title,
    hazardType:   inc.hazardType,
    severity:     inc.severity,
    status:       inc.status,
    description:  inc.description  ?? null,
    locationName: inc.locationName ?? null,
    createdAt:    inc.createdAt,
    updatedAt:    inc.updatedAt,
  };
}
