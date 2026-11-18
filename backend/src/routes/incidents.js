// Incident endpoints and database operations.
import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createIncidentSchema, updateIncidentSchema } from '../validators/incidentValidator.js';

const router = Router();
router.use(authenticate);

function incidentShape(incident) {
  if (!incident) return null;
  return {
    id: incident.id,
    incidentCode: incident.incidentCode,
    title: incident.title,
    hazardType: incident.hazardType,
    severity: incident.severity,
    status: incident.status,
    description: incident.description ?? null,
    locationName: incident.locationName ?? null,
    createdAt: incident.createdAt,
    updatedAt: incident.updatedAt,
  };
}

async function nextIncidentCode() {
  const year = new Date().getFullYear();
  const count = await prisma.incident.count({
    where: { incidentCode: { startsWith: `INC-${year}-` } },
  });
  return `INC-${year}-${String(count + 1).padStart(4, '0')}`;
}

// Dashboard incident totals: GET /api/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [total, active, resolved] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { status: { notIn: ['resolved', 'closed'] } } }),
      prisma.incident.count({ where: { status: 'resolved' } }),
    ]);
    res.json({ total, active, resolved });
  } catch (err) { next(err); }
});

// List incidents: GET /api/incidents
router.get('/incidents', async (req, res, next) => {
  try {
    const incidents = await prisma.incident.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(incidents.map(incidentShape));
  } catch (err) { next(err); }
});

// Create incident: POST /api/incidents
router.post('/incidents', validate(createIncidentSchema), async (req, res, next) => {
  try {
    const incident = await prisma.incident.create({
      data: {
        incidentCode: await nextIncidentCode(),
        title: req.body.title,
        hazardType: req.body.hazardType,
        severity: req.body.severity,
        status: 'reported',
        description: req.body.description || null,
        locationName: req.body.locationName || null,
      },
    });
    res.status(201).json(incidentShape(incident));
  } catch (err) { next(err); }
});

// Read one incident: GET /api/incidents/:id
router.get('/incidents/:id', async (req, res, next) => {
  try {
    const incident = await prisma.incident.findFirst({ where: { id: req.params.id } });
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incidentShape(incident));
  } catch (err) { next(err); }
});

// Update incident: PUT /api/incidents/:id
router.put('/incidents/:id', validate(updateIncidentSchema), async (req, res, next) => {
  try {
    const data = {};
    for (const field of ['title', 'hazardType', 'severity', 'status', 'description', 'locationName']) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }
    if (Object.keys(data).length === 0) {
      const existing = await prisma.incident.findFirst({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ message: 'Incident not found' });
      return res.json(incidentShape(existing));
    }
    const incident = await prisma.incident.update({ where: { id: req.params.id }, data });
    res.json(incidentShape(incident));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Incident not found' });
    next(err);
  }
});

// Delete incident: DELETE /api/incidents/:id
router.delete('/incidents/:id', async (req, res, next) => {
  try {
    await prisma.incident.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Incident not found' });
    next(err);
  }
});

export default router;
