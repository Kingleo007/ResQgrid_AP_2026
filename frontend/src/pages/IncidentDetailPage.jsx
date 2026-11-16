import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';
import SeverityBadge from '../components/SeverityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

// All possible statuses an incident can be in
const STATUS_OPTIONS = ['reported', 'active', 'contained', 'resolved', 'closed'];

export default function IncidentDetailPage() {
  const { id }     = useParams();   // grab the :id from the URL
  const navigate   = useNavigate();

  // The incident object from the backend
  const [incident, setIncident] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Status update state
  const [newStatus, setNewStatus]       = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMsg, setStatusMsg]       = useState(''); // success/error message

  // Load the incident when the page opens
  useEffect(() => {
    async function loadIncident() {
      try {
        const res = await fetch(`/api/incidents/${id}`, { credentials: 'include' });

        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (res.status === 404) {
          setError('Incident not found.');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setIncident(data);
        setNewStatus(data.status); // pre-select current status in the dropdown
      } catch {
        setError('Could not load incident.');
      } finally {
        setLoading(false);
      }
    }

    loadIncident();
  }, [id]); // re-run if the URL id changes

  // Send the updated status to the backend
  async function handleStatusUpdate(e) {
    e.preventDefault();
    setStatusSaving(true);
    setStatusMsg('');

    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setIncident(updated);       // update the displayed data
        setStatusMsg('Status saved!');
      } else {
        setStatusMsg('Failed to update status.');
      }
    } catch {
      setStatusMsg('Could not reach the server.');
    } finally {
      setStatusSaving(false);
    }
  }

  // ── Loading / error states ──────────────────────────────────
  if (loading) return <div className="page"><p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>Loading…</p></div>;

  if (error) {
    return (
      <div className="page">
        <p style={{ color: 'var(--severity-critical)', marginTop: 24 }}>{error}</p>
        <Link to="/incidents" className="btn btn-secondary" style={{ marginTop: 16 }}>← Back</Link>
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div className="page">

      {/* Back link */}
      <Link
        to="/incidents"
        style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', display: 'inline-block', marginBottom: 16 }}
      >
        ← All Incidents
      </Link>

      {/* Page header */}
      <PageHeader
        title={incident.title}
        subtitle={
          <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
            {incident.incidentCode}
          </span>
        }
      />

      {/* Status + severity badges */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <StatusBadge status={incident.status} />
        <SeverityBadge severity={incident.severity} />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textTransform: 'capitalize' }}>
          {incident.hazardType}
        </span>
      </div>

      {/* Two-column layout: details left, status update right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>

        {/* Left — incident details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div className="card">
            <p className="card-title">Details</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--text-sm)' }}>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Location: </span>
                {incident.locationName ?? '—'}
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Created: </span>
                {new Date(incident.createdAt).toLocaleString()}
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Last updated: </span>
                {new Date(incident.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="card">
            <p className="card-title">Description</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.7 }}>
              {incident.description || <em style={{ color: 'var(--ink-muted)' }}>No description provided.</em>}
            </p>
          </div>

        </div>

        {/* Right — update status */}
        <div>
          <div className="card">
            <p className="card-title">Update Status</p>
            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <label className="form-label" htmlFor="status">New status</label>
                <select
                  id="status"
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {/* Capitalise first letter */}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                disabled={statusSaving || newStatus === incident.status}
              >
                {statusSaving ? 'Saving…' : 'Save Status'}
              </button>

              {/* Show a small confirmation or error message */}
              {statusMsg && (
                <p style={{ marginTop: 8, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
                  {statusMsg}
                </p>
              )}
            </form>
          </div>

          {/* Delete button */}
          <div style={{ marginTop: 16 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--severity-critical)' }}
              onClick={async () => {
                if (!window.confirm(`Delete "${incident.title}"? This cannot be undone.`)) return;
                const res = await fetch(`/api/incidents/${id}`, {
                  method: 'DELETE',
                  credentials: 'include',
                });
                if (res.ok) navigate('/incidents');
                else alert('Delete failed.');
              }}
            >
              Delete this incident
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
