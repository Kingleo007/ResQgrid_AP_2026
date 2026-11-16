// frontend/src/api/client.js
// Low-level HTTP client for the ResQGrid API.
// All API modules import from here rather than calling fetch directly.
// Handles: JSON serialisation, 401 redirect, error normalisation.

/** Base URL for all API calls. Set via VITE_API_BASE env var. */
const BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * Makes an authenticated fetch request to the ResQGrid API.
 * Credentials are always included so the httpOnly session cookie is sent.
 *
 * @param {string} path   - Relative path, e.g. '/incidents'
 * @param {RequestInit} [options] - Fetch options (method, body, headers …)
 * @returns {Promise<any>} Parsed JSON response body
 * @throws {{ code: string, message: string, details?: any }}
 */
export async function request(path, options = {}) {
  const url = `${BASE}${path}`;

  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // send httpOnly cookie
  });

  // 401 → kick user to login (avoid redirect loop on the login page itself)
  if (res.status === 401 && !path.startsWith('/auth/login')) {
    window.location.href = '/login';
    return;
  }

  // Parse JSON (even for errors)
  let body;
  const ct = res.headers.get('Content-Type') ?? '';
  if (ct.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    // Normalise error shape: { code, message, details? }
    const err = body?.error ?? {};
    const error = new Error(err.message || `HTTP ${res.status}`);
    error.code = err.code || `HTTP_${res.status}`;
    error.details = err.details;
    error.status = res.status;
    throw error;
  }

  return body;
}

/** GET helper. */
export const get = (path, params) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request(`${path}${qs}`);
};

/** POST helper. */
export const post = (path, data) =>
  request(path, { method: 'POST', body: JSON.stringify(data) });

/** PATCH helper. */
export const patch = (path, data) =>
  request(path, { method: 'PATCH', body: JSON.stringify(data) });

/** DELETE helper. */
export const del = (path) => request(path, { method: 'DELETE' });
