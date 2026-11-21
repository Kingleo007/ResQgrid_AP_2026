// src/app.js — Express app setup for ResQGrid

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import incidentRoutes  from './routes/incidents.js';
import { authRouter, usersRouter } from './routes/users.js';

const app = express();


// middleware package - allow the frontend dev server to send requests with cookies
app.use(cors({
  origin:      config.clientOrigin, // e.g. http://localhost:5173
  credentials: true,              
}));


app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/auth',      authRouter);
// login page sends the login request; it submits a POST with the details

app.use('/api',           incidentRoutes);   
// http://localhost:5173/api/dashboard
// http://localhost:5173/api/incidents


app.use('/api/users',     usersRouter);      // create users


// 404 — route not found
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
});


// Centralized error handler
app.use(errorHandler);

// Start the HTTP server from this file.
const server = app.listen(config.port, () => {
  console.log(`ResQGrid API running on http://localhost:${config.port}`);
});

// Close cleanly when the process is stopped.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    console.log(`${signal} received — shutting down`);
    server.close(() => process.exit(0));
  });
}

export default app;
