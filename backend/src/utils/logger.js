// =============================================================================
// src/utils/logger.js — Structured logger for ResQGrid backend
// Provides info/warn/error methods with ISO timestamp, level, and JSON meta.
// Sensitive fields (password, token, cookie, authorization) are stripped from
// meta objects before logging to prevent accidental secret leakage.
// =============================================================================

/** Fields that must never appear in logs */
const SENSITIVE_KEYS = new Set(['password', 'password_hash', 'token', 'cookie', 'authorization', 'secret']);

/**
 * Recursively strips sensitive keys from a plain object.
 * @param {unknown} obj
 * @returns {unknown}
 */
function sanitize(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      result[k] = '[REDACTED]';
    } else {
      result[k] = sanitize(v);
    }
  }
  return result;
}

/**
 * Formats a log entry as a single-line string.
 */
function format(level, msg, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] ${level.toUpperCase().padEnd(5)} ${msg}`;
  if (meta === undefined || meta === null) return base;
  try {
    return `${base} ${JSON.stringify(sanitize(meta))}`;
  } catch {
    return `${base} [meta serialization failed]`;
  }
}

export const logger = {
  info(msg, meta) {
    console.log(format('info', msg, meta));
  },
  warn(msg, meta) {
    console.warn(format('warn', msg, meta));
  },
  error(msg, meta) {
    console.error(format('error', msg, meta));
  },
};
