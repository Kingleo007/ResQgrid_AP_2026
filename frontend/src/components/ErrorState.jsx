// frontend/src/components/ErrorState.jsx
// Displayed when a data fetch fails. Shows the error message and a retry button.

/**
 * Error state with message and optional retry callback.
 * @param {{ error?: Error|string, onRetry?: () => void }} props
 */
export default function ErrorState({ error, onRetry }) {
  const message =
    typeof error === 'string'
      ? error
      : error?.message ?? 'An unexpected error occurred.';

  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <span className="error-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 21 20H3L12 3Z" />
          <path d="M12 9v4.5M12 17h.01" />
        </svg>
      </span>
      <p className="error-state__title">Something went wrong</p>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
