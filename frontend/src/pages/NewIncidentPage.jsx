import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const UNION_TERRITORIES = [
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra & Nagar Haveli, Daman & Diu' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Puducherry', label: 'Puducherry' },
];

export default function NewIncidentPage() {
  const navigate = useNavigate();

  // Form fields — one state object so it's easy to send as JSON
  const [form, setForm] = useState({
    title: '',
    hazardType: 'other',
    severity: 'moderate',
    city: '',
    state: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Generic field updater — updates just the changed field
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { city, state, ...incidentFields } = form;
      const locationName = [city.trim(), state].filter(Boolean).join(', ');
      // POST the form data to the backend
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...incidentFields, locationName }),
      });

      if (res.ok) {
        // Success → go back to incidents list
        navigate('/incidents');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Failed to create incident.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <PageHeader title="New Incident" subtitle="Report a new incident" />

      {error && (
        <p style={{ color: 'var(--severity-critical)', marginTop: 12, fontSize: 'var(--text-sm)' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 560, marginTop: 24 }}>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            required
            placeholder="e.g. Flash flood in Assam"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/* Hazard Type */}
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label" htmlFor="hazardType">Hazard Type</label>
          <select
            id="hazardType"
            name="hazardType"
            className="form-select"
            value={form.hazardType}
            onChange={handleChange}
          >
            <option value="flood">Flood</option>
            <option value="fire">Fire</option>
            <option value="cyclone">Cyclone</option>
            <option value="earthquake">Earthquake</option>
            <option value="landslide">Landslide</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Severity */}
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label" htmlFor="severity">Severity</label>
          <select
            id="severity"
            name="severity"
            className="form-select"
            value={form.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Location */}
        <div className="incident-location-fields" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              className="form-input"
              autoComplete="off"
              placeholder="e.g. Guwahati"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="state">State / UT</label>
            <select
              id="state"
              name="state"
              className="form-select"
              value={form.state}
              onChange={handleChange}
            >
              <option value="">Select a state or UT</option>
              <optgroup label="States">
                {STATES.map((state) => <option key={state} value={state}>{state}</option>)}
              </optgroup>
              <optgroup label="Union territories">
                {UNION_TERRITORIES.map((territory) => (
                  <option key={territory.value} value={territory.value}>{territory.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            rows={4}
            placeholder="Brief description of the incident…"
            value={form.description}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Incident'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/incidents')}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
