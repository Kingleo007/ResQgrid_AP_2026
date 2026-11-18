// the map is Ai Generated
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
