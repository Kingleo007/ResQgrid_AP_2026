// =============================================================================
// src/db/prisma.js — Singleton PrismaClient for ResQGrid
//
// Prisma 7 no longer reads DATABASE_URL automatically.
// We create a pg connection pool and pass it to PrismaClient via the adapter.
// This is the official Prisma 7 way to connect to PostgreSQL.
// =============================================================================

import 'dotenv/config';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

// Create a standard PostgreSQL connection pool using the DATABASE_URL from .env
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// The adapter bridges pg's pool to Prisma
const adapter = new PrismaPg(pool);

// Shared Prisma client — import this in every model file, never create a new one
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// Cleanly disconnect when Node.js process exits
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
