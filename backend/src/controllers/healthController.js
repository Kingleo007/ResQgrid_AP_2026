// =============================================================================
// src/controllers/healthController.js — Health check for ResQGrid
// GET /health — no auth required; used to check if the server is alive
// =============================================================================

import { prisma } from '../db/prisma.js';

export async function health(req, res) {
  let dbStatus = 'ok';

  try {
    // Simple query to verify the database connection is working
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'ok';
  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    db:     dbStatus,
  });
}
