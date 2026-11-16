// frontend/src/components/StatusBadge.jsx
// Outlined badge with a coloured dot that shows an incident's workflow status.

/**
 * Displays a status badge with dot indicator.
 * @param {{ status: string }} props
 */
export default function StatusBadge({ status }) {
  if (!status) return null;
  const s = status.toLowerCase();
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <span className={`status-badge status-badge--${s}`} aria-label={`Status: ${label}`}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
