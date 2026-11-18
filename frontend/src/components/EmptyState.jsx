// frontend/src/components/EmptyState.jsx
// Displayed when a list has no items matching the current filters.

/**
 * Empty state illustration with optional action.
 * @param {{ title?: string, description?: string, action?: React.ReactNode }} props
 */
export default function EmptyState({ title = 'No results', description, action }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <span className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5h16v13H4z" />
          <path d="M4 13h4l1.5 2h5L16 13h4M8 9h8" />
        </svg>
      </span>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__desc">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
