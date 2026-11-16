// frontend/src/hooks/useFetch.js
// Generic data-fetching hook with loading / error / data states.
// Re-runs when any item in deps changes (similar to useEffect deps).

import { useState, useEffect, useCallback } from 'react';

/**
 * Fetches data by calling fetchFn() whenever deps change.
 * Returns { data, loading, error, refresh }.
 *
 * @param {() => Promise<any>} fetchFn - Async function that returns data
 * @param {any[]} deps - Dependency array (re-fetches when changed)
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cancel = run();
    return cancel;
  }, [run]);

  return { data, loading, error, refresh: run };
}
