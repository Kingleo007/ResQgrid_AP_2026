// frontend/src/components/IncidentFormDrawer.jsx
// Slide-in drawer for creating or editing an incident.
// Covers: title, hazard_type, severity, description, location_name, lat, lng, state, district.

import { useState, useEffect } from 'react';
import { HAZARD_TYPES, SEVERITIES, HAZARD_LABELS, SEVERITY_LABELS } from '../utils/constants.js';

/** Empty form state. */
const EMPTY = {
  title: '',
  hazard_type: 'flood',
  severity: 'moderate',
  description: '',
  location_name: '',
  latitude: '',
  longitude: '',
  state: '',
  district: '',
};

/**
 * Drawer form for creating or editing an incident.
 * @param {{
 *   open: boolean,
 *   initial?: object,       // pre-filled values for edit mode
 *   onSubmit: (data: object) => Promise<void>,
 *   onClose: () => void,
 * }} props
 */
export default function IncidentFormDrawer({ open, initial, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Populate form when opened (edit mode) or reset (create mode).
  useEffect(() => {
    if (open) {
      setForm(initial
        ? {
            title: initial.title ?? '',
            hazard_type: initial.hazard_type ?? 'flood',
            severity: initial.severity ?? 'moderate',
            description: initial.description ?? '',
            location_name: initial.location_name ?? '',
            latitude: initial.latitude ?? '',
            longitude: initial.longitude ?? '',
            state: initial.state ?? '',
            district: initial.district ?? '',
          }
        : EMPTY
      );
      setErrors({});
      setSubmitError('');
    }
  }, [open, initial]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  /** Update a single field. */
  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  /** Client-side validation. */
  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (form.latitude && isNaN(parseFloat(form.latitude))) e.latitude = 'Must be a number.';
    if (form.longitude && isNaN(parseFloat(form.longitude))) e.longitude = 'Must be a number.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitError('');
    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      };
      // Remove undefined keys.
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to save incident.');
    } finally {
      setLoading(false);
    }
  }

  const isEdit = !!initial;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      {/* Drawer */}
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <h2 className="drawer-title" id="drawer-title">
            {isEdit ? 'Edit Incident' : 'New Incident'}
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close drawer">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="drawer-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label form-label-required" htmlFor="inc-title">Title</label>
              <input
                id="inc-title"
                className={`form-input${errors.title ? ' form-input--error' : ''}`}
                value={form.title}
                onChange={set('title')}
                placeholder="Brief description of the incident"
                required
                autoFocus
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Hazard + Severity */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label form-label-required" htmlFor="inc-hazard">
                  Hazard type
                </label>
                <select id="inc-hazard" className="form-select" value={form.hazard_type} onChange={set('hazard_type')}>
                  {HAZARD_TYPES.map((h) => (
                    <option key={h} value={h}>{HAZARD_LABELS[h] ?? h}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label form-label-required" htmlFor="inc-severity">
                  Severity
                </label>
                <select id="inc-severity" className="form-select" value={form.severity} onChange={set('severity')}>
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>{SEVERITY_LABELS[s] ?? s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="inc-desc">Description</label>
              <textarea
                id="inc-desc"
                className="form-textarea"
                value={form.description}
                onChange={set('description')}
                placeholder="Situation details, impact, population affected…"
                rows={4}
              />
            </div>

            {/* Location name */}
            <div className="form-group">
              <label className="form-label" htmlFor="inc-loc">Location name</label>
              <input
                id="inc-loc"
                className="form-input"
                value={form.location_name}
                onChange={set('location_name')}
                placeholder="e.g. Brahmaputra Floodplain, Assam"
              />
            </div>

            {/* Lat / Lng */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="inc-lat">Latitude</label>
                <input
                  id="inc-lat"
                  type="number"
                  step="any"
                  className={`form-input${errors.latitude ? ' form-input--error' : ''}`}
                  value={form.latitude}
                  onChange={set('latitude')}
                  placeholder="e.g. 26.14"
                />
                {errors.latitude && <span className="form-error">{errors.latitude}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="inc-lng">Longitude</label>
                <input
                  id="inc-lng"
                  type="number"
                  step="any"
                  className={`form-input${errors.longitude ? ' form-input--error' : ''}`}
                  value={form.longitude}
                  onChange={set('longitude')}
                  placeholder="e.g. 91.74"
                />
                {errors.longitude && <span className="form-error">{errors.longitude}</span>}
              </div>
            </div>

            {/* State / District */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="inc-state">State</label>
                <input
                  id="inc-state"
                  className="form-input"
                  value={form.state}
                  onChange={set('state')}
                  placeholder="e.g. Assam"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="inc-district">District</label>
                <input
                  id="inc-district"
                  className="form-input"
                  value={form.district}
                  onChange={set('district')}
                  placeholder="e.g. Dhemaji"
                />
              </div>
            </div>

            {submitError && (
              <div className="form-error" role="alert">{submitError}</div>
            )}
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create incident'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
