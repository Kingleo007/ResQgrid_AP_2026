// frontend/src/components/SeverityBadge.jsx
// Filled badge that shows an incident's severity level with a colour-coded background.

function SeverityIcon({ severity }) {
  if (severity === 'low') {
    return <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.3 2.3 4.8-5" /></>;
  }

  if (severity === 'moderate') {
    return <><circle cx="12" cy="12" r="8.5" /><path d="M12 10.5v5M12 7.8h.01" /></>;
  }

  if (severity === 'high') {
    return <><path d="m12 3 9 9-9 9-9-9 9-9Z" /><path d="M12 8.5v5M12 17h.01" /></>;
  }

  return <><path d="m12 3.5 9 17H3l9-17Z" /><path d="M12 9v4.5M12 17h.01" /></>;
}

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
      <svg className="severity-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <SeverityIcon severity={s} />
      </svg>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}
