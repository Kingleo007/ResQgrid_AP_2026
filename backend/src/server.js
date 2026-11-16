// =============================================================================
// src/server.js — HTTP server entry point for ResQGrid
// Starts Express and handles graceful shutdown on SIGTERM.
// =============================================================================

import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

// Start the HTTP server
const server = app.listen(config.port, () => {
  logger.info(`[server] ResQGrid API running on http://localhost:${config.port}`, {
    port:    config.port,
    nodeEnv: config.nodeEnv,
  });
});

// Graceful shutdown on SIGTERM (e.g. Ctrl+C or docker stop)
process.on('SIGTERM', () => {
  logger.info('[server] SIGTERM received — shutting down');
  server.close(() => {
    logger.info('[server] HTTP server closed');
    process.exit(0);
  });
});
