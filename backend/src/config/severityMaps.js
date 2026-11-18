// =============================================================================
// src/config/severityMaps.js — Heuristic severity mappings for external feeds
// Maps external alert severity vocabulary to ResQGrid's internal enum:
//   critical | high | moderate | low
// All mappings are heuristics — real-world interpretation may differ.
// =============================================================================

export function magnitudeToSeverity(mag) {
  if (mag >= 7.0) return 'critical';  // Major earthquake — widespread damage expected
  if (mag >= 6.0) return 'high';      // Strong earthquake — significant damage likely
  if (mag >= 5.0) return 'moderate';  // Moderate earthquake — some damage possible
  return 'low';                        // Light/minor earthquake — felt but rarely damaging
}

export const GDACS_ALERT_LEVEL_MAP = {
  Red:    'critical',  // GDACS: Highest severity — immediate response needed
  Orange: 'high',      // GDACS: Significant impact — monitoring and response required
  Green:  'low',       // GDACS: Minimal impact — informational only
};
