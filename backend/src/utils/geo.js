// =============================================================================
// src/utils/geo.js — Geospatial utility functions for ResQGrid
// Provides helpers for converting external feed geometry formats to the
// internal representation used for map display and storage.
// =============================================================================

/**
 * Computes the centroid of a GeoJSON polygon ring by averaging coordinates.
 * This is a simple arithmetic mean — not area-weighted — sufficient for
 * displaying a representative point on the map for bounding polygons.
 *
 * @param {[number, number][]} coordinates - GeoJSON ring: array of [lon, lat] pairs
 * @returns {{ lat: number, lng: number } | null}
 */
export function centroidFromPolygon(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return null;

  let sumLon = 0;
  let sumLat = 0;
  let count = 0;

  for (const point of coordinates) {
    if (!Array.isArray(point) || point.length < 2) continue;
    sumLon += point[0]; // GeoJSON order: [longitude, latitude]
    sumLat += point[1];
    count++;
  }

  if (count === 0) return null;

  return {
    lat: sumLat / count,
    lng: sumLon / count,
  };
}

/**
 * Converts a CAP (Common Alerting Protocol) polygon string to a GeoJSON Polygon.
 *
 * IMPORTANT coordinate-order swap:
 *   CAP uses "lat lon" pairs (space-separated within each pair, pairs separated by spaces)
 *   GeoJSON requires [longitude, latitude] order
 *   This function performs that swap — the reversal is intentional.
 *
 * CAP example:  "28.5 77.1 28.6 77.2 28.4 77.3 28.5 77.1"
 * GeoJSON output: { type: "Polygon", coordinates: [[ [77.1, 28.5], [77.2, 28.6], ... ]] }
 *
 * @param {string} capPolygonStr - Space-separated "lat,lon" pairs from a CAP alert
 * @returns {{ type: 'Polygon', coordinates: [number, number][][] } | null}
 */
export function capPolygonToGeoJSON(capPolygonStr) {
  if (!capPolygonStr || typeof capPolygonStr !== 'string') return null;

  const pairs = capPolygonStr.trim().split(/\s+/);
  const ring = [];

  for (const pair of pairs) {
    const parts = pair.split(',');
    if (parts.length < 2) continue;

    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lon)) continue;

    // Swap: CAP is lat,lon → GeoJSON is [lon, lat]
    ring.push([lon, lat]);
  }

  if (ring.length < 3) return null; // Not a valid polygon

  // GeoJSON polygons must be closed (first point === last point)
  const first = ring[0];
  const last  = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  return {
    type: 'Polygon',
    coordinates: [ring],
  };
}
