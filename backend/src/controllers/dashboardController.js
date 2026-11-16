// =============================================================================
// src/controllers/dashboardController.js — Dashboard stats for ResQGrid
// GET /api/dashboard — returns total, active, and resolved incident counts
// =============================================================================

import { prisma } from '../db/prisma.js';

// ---------------------------------------------------------------------------
// GET /api/dashboard
// ---------------------------------------------------------------------------
export async function getStats(req, res, next) {
  try {
    // Count all incidents
    const total = await prisma.incident.count();

    // Count incidents that are NOT resolved or closed (= "active")
    const active = await prisma.incident.count({
      where: { status: { notIn: ['resolved', 'closed'] } },
    });

    // Count resolved incidents
    const resolved = await prisma.incident.count({
      where: { status: 'resolved' },
    });

    // Send back a simple object — the frontend reads stats.total, stats.active, stats.resolved
    return res.json({ total, active, resolved });
  } catch (err) {
    next(err);
  }
}
