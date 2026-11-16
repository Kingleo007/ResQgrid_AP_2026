// =============================================================================
// src/config/severityMaps.js — Heuristic severity mappings for external feeds
// Maps external alert severity vocabulary to ResQGrid's internal enum:
//   critical | high | moderate | low
// All mappings are heuristics — real-world interpretation may differ.
// =============================================================================

/**
 * CAP (Common Alerting Protocol) severity → ResQGrid severity
 * Source: OASIS CAP standard v1.2 severity field
 * Heuristic: Extreme/Severe map to our top two levels; the rest fall below.
 */
export const CAP_SEVERITY_MAP = {
  Extreme:  'critical',  // CAP: Extraordinary threat to life or property
  Severe:   'high',      // CAP: Significant threat to life or property
  Moderate: 'moderate',  // CAP: Possible threat to life or property
  Minor:    'low',       // CAP: Minimal to no known threat to life or property
  Unknown:  'low',       // CAP: Severity unknown — default to low to avoid false elevation
};

/**
 * USGS earthquake magnitude → ResQGrid severity
 * Heuristic based on Modified Mercalli Intensity (MMI) and USGS pager scale.
 * @param {number} mag - Richter/moment magnitude
 * @returns {'critical'|'high'|'moderate'|'low'}
 */
export function magnitudeToSeverity(mag) {
  if (mag >= 7.0) return 'critical';  // Major earthquake — widespread damage expected
  if (mag >= 6.0) return 'high';      // Strong earthquake — significant damage likely
  if (mag >= 5.0) return 'moderate';  // Moderate earthquake — some damage possible
  return 'low';                        // Light/minor earthquake — felt but rarely damaging
}

/**
 * GDACS alert level → ResQGrid severity
 * Source: GDACS (Global Disaster Alert and Coordination System) color coding
 * Heuristic: GDACS levels align closely to our top three severity tiers.
 */
export const GDACS_ALERT_LEVEL_MAP = {
  Red:    'critical',  // GDACS: Highest severity — immediate response needed
  Orange: 'high',      // GDACS: Significant impact — monitoring and response required
  Green:  'low',       // GDACS: Minimal impact — informational only
};
