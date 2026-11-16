// frontend/src/utils/format.js
// Formatting utilities for dates, durations, and strings.

/** IST formatter — displays a date in India Standard Time (Asia/Kolkata). */
const istFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * Formats a date value as a human-readable IST string.
 * @param {string|Date|null} date
 * @returns {string}
 */
export function formatIST(date) {
  if (!date) return '—';
  try {
    return istFormatter.format(new Date(date));
  } catch {
    return '—';
  }
}

/**
 * Returns a human-readable relative time string (e.g. "2h ago", "3d ago").
 * Falls back to formatIST for dates older than 30 days.
 * @param {string|Date|null} date
 * @returns {string}
 */
export function formatRelative(date) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return formatIST(date);
  } catch {
    return '—';
  }
}

/**
 * Capitalises the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to maxLen characters, appending "…" if truncated.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 80) {
  if (!str || str.length <= maxLen) return str ?? '';
  return str.slice(0, maxLen) + '…';
}
