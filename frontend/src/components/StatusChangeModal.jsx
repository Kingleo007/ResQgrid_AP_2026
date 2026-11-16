// frontend/src/components/StatusChangeModal.jsx
// Modal for transitioning an incident's workflow status.
// Shows only the valid next statuses (from STATUS_TRANSITIONS).
// Requires a message when moving to resolved or closed.

import { useState, useEffect, useRef } from 'react';
import { STATUS_TRANSITIONS, STATUS_LABELS } from '../utils/constants.js';

/**
 * @param {{
 *   open: boolean,
 *   currentStatus: string,
 *   onSubmit: (data: { status: string, message: string }) => Promise<void>,
 *   onClose: () => void,
 * }} props
 */
export default function StatusChangeModal({ open, currentStatus, onSubmit, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const firstRef = useRef(null);

  // Reset state when modal opens.
  useEffect(() => {
    if (open) {
      const nexts = STATUS_TRANSITIONS[currentStatus] ?? [];
      setSelectedStatus(nexts[0] ?? '');
      setMessage('');
      setError('');
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open, currentStatus]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const nexts = STATUS_TRANSITIONS[currentStatus] ?? [];
  const requiresMessage = ['resolved', 'closed'].includes(selectedStatus);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedStatus) return;
    if (requiresMessage && !message.trim()) {
      setError('A message is required when resolving or closing an incident.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ status: selectedStatus, message: message.trim() });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to change status. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="sc-title">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="sc-title">Change Status</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label form-label-required" htmlFor="next-status">
                New status
              </label>
              {nexts.length === 0 ? (
                <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>
                  No further transitions available for this status.
                </p>
              ) : (
                <select
                  id="next-status"
                  ref={firstRef}
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  required
                >
                  {nexts.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label
                className={`form-label${requiresMessage ? ' form-label-required' : ''}`}
                htmlFor="status-message"
              >
                Message / notes {requiresMessage ? '' : '(optional)'}
              </label>
              <textarea
                id="status-message"
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Describe the reason for this status change…"
                required={requiresMessage}
              />
            </div>

            {error && (
              <div className="form-error" role="alert">{error}</div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || nexts.length === 0}
            >
              {loading ? 'Saving…' : 'Update status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
