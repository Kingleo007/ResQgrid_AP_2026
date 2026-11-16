// frontend/src/components/LoadingSkeleton.jsx
// Animated placeholder rows shown while data is loading.

/**
 * Renders n skeleton rows to indicate loading state.
 * @param {{ rows?: number, cols?: number }} props
 */
export default function LoadingSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="skeleton-wrapper" aria-label="Loading…" aria-busy="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="skeleton-row">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skeleton-cell" style={{ flex: c === 0 ? 2 : 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
