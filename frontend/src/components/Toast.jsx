// frontend/src/components/Toast.jsx
// Simple toast notification system using React context + a fixed overlay container.

import { createContext, useContext, useState, useCallback, useRef } from 'react';

/** @type {React.Context} */
const ToastContext = createContext(null);

let _id = 0;

/**
 * ToastProvider must wrap the app (or at least the pages that show toasts).
 * Children can call useToast() to show/dismiss toasts.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  /**
   * Show a toast notification.
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} [kind='info']
   * @param {number} [duration=4000] ms before auto-dismiss
   */
  const show = useCallback((message, kind = 'info', duration = 4000) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, kind }]);
    if (duration > 0) {
      timers.current[id] = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        delete timers.current[id];
      }, duration);
    }
    return id;
  }, []);

  /** Dismiss a toast by id. */
  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      {/* Fixed overlay — rendered outside any scroll container */}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.kind}`} role="alert">
            <span className="toast__message">{t.message}</span>
            <button
              className="toast__close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Returns show(message, kind, duration) and dismiss(id) helpers.
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
