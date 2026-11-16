// frontend/src/components/SeverityBadge.jsx
// Filled badge that shows an incident's severity level with a colour-coded background.

/** Map severity → icon character. */
const ICONS = {
  critical: '🔴',
  high: '🟠',
  moderate: '🟡',
  low: '🟢',
};

/**
 * Displays a severity badge with icon and label.
 * @param {{ severity: string, size?: 'sm'|'md' }} props
 */
export default function SeverityBadge({ severity, size = 'md' }) {
  if (!severity) return null;
  const s = severity.toLowerCase();
  return (
    <span
      className={`severity-badge severity-badge--${s} severity-badge--${size}`}
      aria-label={`Severity: ${s}`}
    >
      <span aria-hidden="true">{ICONS[s] ?? '⚪'}</span>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}
