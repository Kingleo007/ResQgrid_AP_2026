// =============================================================================
// src/models/userModel.js — User database queries for ResQGrid (Prisma 7)
// All DB access goes through the shared prisma singleton from db/prisma.js
// =============================================================================

import { prisma } from '../db/prisma.js';

// ---------------------------------------------------------------------------
// findByEmail
// Used by login: returns user WITH passwordHash so we can compare it
// ---------------------------------------------------------------------------
export async function findByEmail(email) {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  return user;
}

// ---------------------------------------------------------------------------
// findById
// Used by authenticate middleware: returns user WITHOUT passwordHash
// ---------------------------------------------------------------------------
export async function findById(id) {
  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, name: true, email: true },
  });
  return user;
}

// ---------------------------------------------------------------------------
// listAll
// Returns all users, newest first — passwordHash excluded
// ---------------------------------------------------------------------------
export async function listAll() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return users;
}

// ---------------------------------------------------------------------------
// createUser
// Inserts a new user row — passwordHash must already be hashed by the caller
// ---------------------------------------------------------------------------
export async function createUser({ name, email, passwordHash }) {
  // Check if email is already taken
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    const err = new Error('A user with that email already exists');
    err.status = 409; // 409 Conflict
    throw err;
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return user;
}
