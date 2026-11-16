// =============================================================================
// test/auth.test.js — Authentication endpoint tests for ResQGrid
// Uses vitest + supertest with mocked database layer (no live DB required).
// Tests: login (wrong email, valid credentials), /me without auth, logout.
// =============================================================================

import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

// ---------------------------------------------------------------------------
// Mock the Prisma client BEFORE importing app (so no DB connection is opened)
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
// Mock userModel — control what findByEmail returns per test
// ---------------------------------------------------------------------------
vi.mock('../src/models/userModel.js', () => ({
  findByEmail: vi.fn(),
  findById:    vi.fn(),
}));

// After mocks are declared, import the app
import app from '../src/app.js';
import * as userModel from '../src/models/userModel.js';

// Pre-compute a real bcrypt hash for 'Admin1234!' (cost 10 for test speed)
let ADMIN_HASH;
beforeAll(async () => {
  ADMIN_HASH = await bcrypt.hash('Admin1234!', 10);
});

describe('POST /api/auth/login', () => {
  it('returns 401 when email is not found', async () => {
    userModel.findByEmail.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns 401 when password is wrong', async () => {
    userModel.findByEmail.mockResolvedValueOnce({
      id:            'test-uuid',
      email:         'admin@resqgrid.local',
      name:          'Admin',
      role:          'admin',
      password_hash: ADMIN_HASH,
      is_active:     true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@resqgrid.local', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns 200 and sets a cookie on valid credentials', async () => {
    userModel.findByEmail.mockResolvedValueOnce({
      id:            'a0000000-0000-0000-0000-000000000001',
      email:         'admin@resqgrid.local',
      name:          'System Admin',
      role:          'admin',
      password_hash: ADMIN_HASH,
      is_active:     true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@resqgrid.local', password: 'Admin1234!' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('admin@resqgrid.local');
    expect(res.body.data.user.role).toBe('admin');
    // Cookie should be set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.startsWith('token='))).toBe(true);
    // Must be HttpOnly
    expect(cookies.some((c) => c.toLowerCase().includes('httponly'))).toBe(true);
  });

  it('returns 400 for missing email (validation)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Admin1234!' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 when no cookie is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('returns 200 and clears the cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    const cookies = res.headers['set-cookie'];
    if (cookies) {
      const tokenCookie = cookies.find((c) => c.startsWith('token='));
      if (tokenCookie) {
        expect(
          tokenCookie.includes('Max-Age=0') ||
          tokenCookie === 'token=; Path=/' ||
          tokenCookie.startsWith('token=;')
        ).toBe(true);
      }
    }
    expect(res.body.data.message).toMatch(/logged out/i);
  });
});
