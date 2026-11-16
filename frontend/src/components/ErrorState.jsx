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
      <span className="error-state__icon" aria-hidden="true">⚠️</span>
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
