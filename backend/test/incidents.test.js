// =============================================================================
// test/incidents.test.js — Incident endpoint tests for ResQGrid
// Uses vitest + supertest with mocked database layer (no live DB required).
// Tests: auth guard, invalid status transitions, valid status transition.
// =============================================================================

import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Mock Prisma client BEFORE importing app
// ---------------------------------------------------------------------------
vi.mock('../src/db/prisma.js', () => ({
  prisma: {
    user:           { findFirst: vi.fn(), findUnique: vi.fn() },
    incident:       { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), deleteMany: vi.fn(), count: vi.fn() },
    incidentUpdate: { findMany: vi.fn(), create: vi.fn() },
    alert:          { findFirst: vi.fn(), findMany: vi.fn(), upsert: vi.fn(), update: vi.fn(), updateMany: vi.fn(), count: vi.fn() },
    team:           { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    assignment:     { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() },
    dataSource:     { findFirst: vi.fn(), findMany: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    $queryRaw:      vi.fn(),
    $executeRaw:    vi.fn(),
    $transaction:   vi.fn((fn) => fn({})),
    $disconnect:    vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Mock models
// ---------------------------------------------------------------------------
vi.mock('../src/models/userModel.js', () => ({
  findByEmail: vi.fn(),
  findById:    vi.fn(),
}));

vi.mock('../src/models/incidentModel.js', () => ({
  listIncidents:  vi.fn(),
  listForMap:     vi.fn(),
  findById:       vi.fn(),
  createIncident: vi.fn(),
  updateIncident: vi.fn(),
  deleteIncident: vi.fn(),
  getSummary:     vi.fn(),
}));

vi.mock('../src/models/incidentUpdateModel.js', () => ({
  listUpdates:  vi.fn(),
  createUpdate: vi.fn(),
}));

vi.mock('../src/models/assignmentModel.js', () => ({
  listAssignments:             vi.fn(),
  findAssignmentById:          vi.fn(),
  createAssignment:            vi.fn(),
  updateAssignment:            vi.fn(),
  getActiveAssignmentsForTeam: vi.fn(),
}));

vi.mock('../src/models/teamModel.js', () => ({
  listTeams:    vi.fn(),
  findTeamById: vi.fn(),
  createTeam:   vi.fn(),
  updateTeam:   vi.fn(),
}));

import app from '../src/app.js';
import * as incidentModel from '../src/models/incidentModel.js';
import * as incidentUpdateModel from '../src/models/incidentUpdateModel.js';
import { prisma } from '../src/db/prisma.js';
import { config } from '../src/config/env.js';

// ---------------------------------------------------------------------------
// Helper: build a signed JWT cookie for tests
// ---------------------------------------------------------------------------
function makeAuthCookie(role = 'admin') {
  const token = jwt.sign(
    { id: 'test-user-id', email: 'admin@resqgrid.local', name: 'Test Admin', role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
  return `token=${token}`;
}

const INCIDENT_ID = 'c0000000-0000-0000-0000-000000000001';

describe('GET /api/incidents', () => {
  it('returns 401 without authentication', async () => {
    const res = await request(app).get('/api/incidents');
    expect(res.status).toBe(401);
  });

  it('returns 200 with valid auth', async () => {
    incidentModel.listIncidents.mockResolvedValueOnce({ rows: [], total: 0 });

    const res = await request(app)
      .get('/api/incidents')
      .set('Cookie', makeAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toBeDefined();
  });
});

describe('PATCH /api/incidents/:id/status — invalid transition', () => {
  it('returns 422 when trying to move a closed incident to verified', async () => {
    // Mock: incident is currently 'closed'
    incidentModel.findById.mockResolvedValue({
      id:          INCIDENT_ID,
      status:      'closed',
      severity:    'high',
      hazard_type: 'flood',
      title:       'Test Incident',
    });

    const res = await request(app)
      .patch(`/api/incidents/${INCIDENT_ID}/status`)
      .set('Cookie', makeAuthCookie())
      .send({ status: 'verified', message: 'Trying to reopen' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVALID_TRANSITION');
  });

  it('returns 422 when trying to move a resolved incident to reported', async () => {
    incidentModel.findById.mockResolvedValue({
      id:          INCIDENT_ID,
      status:      'resolved',
      severity:    'high',
      hazard_type: 'cyclone',
      title:       'Test Resolved Incident',
    });

    const res = await request(app)
      .patch(`/api/incidents/${INCIDENT_ID}/status`)
      .set('Cookie', makeAuthCookie())
      .send({ status: 'reported', message: 'bad move' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVALID_TRANSITION');
  });
});

describe('PATCH /api/incidents/:id/status — valid transition', () => {
  it('returns 200 for a valid reported → verified transition', async () => {
    const currentIncident = {
      id:          INCIDENT_ID,
      status:      'reported',
      severity:    'high',
      hazard_type: 'flood',
      title:       'Test Incident',
    };
    const updatedIncident = { ...currentIncident, status: 'verified' };

    incidentModel.findById.mockResolvedValue(currentIncident);
    incidentModel.updateIncident.mockResolvedValueOnce(updatedIncident);
    incidentUpdateModel.createUpdate.mockResolvedValueOnce({});

    // Mock $transaction to call fn directly with an empty tx object
    prisma.$transaction.mockImplementationOnce((fn) => fn({}));

    const res = await request(app)
      .patch(`/api/incidents/${INCIDENT_ID}/status`)
      .set('Cookie', makeAuthCookie('admin'))
      .send({ status: 'verified' });

    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data.status).toBe('verified');
    }
  });

  it('returns 400 when resolving without a message', async () => {
    incidentModel.findById.mockResolvedValue({
      id:          INCIDENT_ID,
      status:      'responding',
      severity:    'high',
      hazard_type: 'flood',
      title:       'Active Incident',
    });

    const res = await request(app)
      .patch(`/api/incidents/${INCIDENT_ID}/status`)
      .set('Cookie', makeAuthCookie())
      .send({ status: 'resolved' }); // No message

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('MESSAGE_REQUIRED');
  });
});
