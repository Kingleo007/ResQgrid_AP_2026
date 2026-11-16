// =============================================================================
// src/config/hazardMap.js — Keyword-based hazard type classifier for ResQGrid
// Maps free-text event descriptions from external feeds to the internal
// hazard_type enum: flood|cyclone|earthquake|landslide|fire|heatwave|storm|drought|other
// =============================================================================

/**
 * Maps an event text string to a ResQGrid hazard_type enum value.
 * Matching is case-insensitive and keyword-based (first match wins).
 *
 * @param {string} eventText - Free-text event description from an external feed
 * @returns {'flood'|'cyclone'|'earthquake'|'landslide'|'fire'|'heatwave'|'storm'|'drought'|'other'}
 */
export function mapHazard(eventText) {
  if (!eventText || typeof eventText !== 'string') return 'other';

  const text = eventText.toLowerCase();

  // flood: heavy rainfall often triggers flooding; treat heavy rain as flood
  if (/flood|flooding|heavy rain|heavy rainfall|inundation/.test(text)) return 'flood';

  // cyclone: tropical storms known by different names globally
  if (/cyclone|hurricane|typhoon/.test(text)) return 'cyclone';

  // earthquake: seismic events including aftershocks
  if (/earthquake|quake|tremor|seismic|aftershock/.test(text)) return 'earthquake';

  // landslide: includes mudflows and debris flows
  if (/landslide|mudslide|mudflow|debris flow/.test(text)) return 'landslide';

  // fire: wildfire and forest fire are distinct from structural fire but same hazard type
  if (/\bfire\b|wildfire|forest fire|bushfire/.test(text)) return 'fire';

  // heatwave: extreme heat events
  if (/heat|heatwave|heat wave|extreme heat/.test(text)) return 'heatwave';

  // storm: thunderstorm, lightning, and squall lines
  if (/storm|thunder|thunderstorm|lightning|squall|gale/.test(text)) return 'storm';

  // drought: water scarcity events
  if (/drought|dry spell|water scarcity/.test(text)) return 'drought';

  // Catch-all: unknown or unmapped event type
  return 'other';
}
