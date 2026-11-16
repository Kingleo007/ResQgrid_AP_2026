// frontend/src/utils/constants.js
// Shared enumeration constants used across the UI.
// Mirrors the backend's enum values so the two stay in sync.

/** All supported hazard types (matches backend hazardMap.js keys). */
export const HAZARD_TYPES = [
  'flood',
  'cyclone',
  'earthquake',
  'landslide',
  'fire',
  'heatwave',
  'storm',
  'drought',
  'other',
];

/** Severity levels in descending order of urgency. */
export const SEVERITIES = ['critical', 'high', 'moderate', 'low'];

/** All incident workflow states. */
export const INCIDENT_STATUSES = [
  'reported',
  'verified',
  'responding',
  'monitoring',
  'resolved',
  'closed',
];

/** Valid status transitions (from → allowed nexts). */
export const STATUS_TRANSITIONS = {
  reported: ['verified', 'closed'],
  verified: ['responding', 'monitoring', 'closed'],
  responding: ['monitoring', 'resolved', 'closed'],
  monitoring: ['responding', 'resolved', 'closed'],
  resolved: ['closed'],
  closed: [],
};

/** Team kinds available in the system. */
export const TEAM_KINDS = ['NDRF', 'SDRF', 'Medical', 'Fire', 'Other'];

/** Hazard type display labels. */
export const HAZARD_LABELS = {
  flood: 'Flood',
  cyclone: 'Cyclone',
  earthquake: 'Earthquake',
  landslide: 'Landslide',
  fire: 'Fire',
  heatwave: 'Heatwave',
  storm: 'Storm',
  drought: 'Drought',
  other: 'Other',
};

/** Severity display labels. */
export const SEVERITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
};

/** Status display labels. */
export const STATUS_LABELS = {
  reported: 'Reported',
  verified: 'Verified',
  responding: 'Responding',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
  closed: 'Closed',
};
