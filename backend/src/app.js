// =============================================================================
// src/app.js — Express app setup for ResQGrid
// Registers middleware and routes. Kept simple — only what we need.
// =============================================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes      from './routes/auth.js';
import incidentRoutes  from './routes/incidents.js';
import dashboardRoutes from './routes/dashboard.js';
import healthRoutes    from './routes/health.js';
import userRoutes      from './routes/users.js';

const app = express();

// Security headers (helmet sets sensible defaults)
app.use(helmet());

// CORS — allow the frontend dev server to send requests with cookies
app.use(cors({
  origin:      config.clientOrigin, // e.g. http://localhost:5173
  credentials: true,                // needed so cookies are included in cross-origin requests
}));

// Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Log every request (method, path, status, duration)
app.use(requestLogger);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/health',        healthRoutes);     // GET /health — simple alive check
app.use('/api/health',    healthRoutes);
app.use('/api/auth',      authRoutes);       // POST /api/auth/login, /logout, GET /me
app.use('/api/dashboard', dashboardRoutes);  // GET /api/dashboard
app.use('/api/incidents', incidentRoutes);   // CRUD for incidents
app.use('/api/users',     userRoutes);       // list + create users

// ---------------------------------------------------------------------------
// 404 — route not found
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
});

// ---------------------------------------------------------------------------
// Centralized error handler (must be last — 4-argument signature)
// ---------------------------------------------------------------------------
app.use(errorHandler);

export default app;
