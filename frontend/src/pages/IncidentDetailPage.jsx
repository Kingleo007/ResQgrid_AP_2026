import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';
import SeverityBadge from '../components/SeverityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatIST } from '../utils/format.js';

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
  if (loading) return <div className="page"><p className="incident-register__message" role="status">Loading incident details…</p></div>;

  if (error) {
    return (
      <div className="page">
        <p className="incident-register__message incident-register__message--error" role="alert">{error}</p>
        <Link to="/incidents" className="btn btn-secondary incident-detail__error-action">← Back to incidents</Link>
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div className="page">

      {/* Back link */}
      <Link
        to="/incidents"
        className="incident-detail__back"
      >
        <span aria-hidden="true">←</span>&nbsp; All incidents
      </Link>

      {/* Page header */}
      <PageHeader
        title={incident.title}
        subtitle={
          <span className="incident-table__code">
            {incident.incidentCode}
          </span>
        }
      />

      {/* Status + severity badges */}
      <div className="incident-detail__badges">
        <StatusBadge status={incident.status} />
        <SeverityBadge severity={incident.severity} />
        <span className="incident-detail__hazard">
          {incident.hazardType}
        </span>
      </div>

      {/* Two-column layout: details left, status update right */}
      <div className="incident-detail__grid">

        {/* Left — incident details */}
        <div className="incident-detail__column">

          <section className="card incident-detail__card">
            <p className="card-title">Details</p>
            <div className="incident-detail__fields">
              <div className="incident-detail__field">
                <span>Location</span>
                <p>{incident.locationName ?? '—'}</p>
              </div>
              <div className="incident-detail__field">
                <span>Created</span>
                <p>{formatIST(incident.createdAt)}</p>
              </div>
              <div className="incident-detail__field">
                <span>Last updated</span>
                <p>{formatIST(incident.updatedAt)}</p>
              </div>
            </div>
          </section>

          <section className="card incident-detail__card">
            <p className="card-title">Description</p>
            <p className="incident-detail__description">
              {incident.description || <em>No description provided.</em>}
            </p>
          </section>

        </div>

        {/* Right — update status */}
        <div className="incident-detail__column">
          <section className="card incident-detail__card">
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
                className="btn btn-primary incident-detail__save"
                disabled={statusSaving || newStatus === incident.status}
              >
                {statusSaving ? 'Saving…' : 'Save Status'}
              </button>

              {/* Show a small confirmation or error message */}
              {statusMsg && (
                <p className="incident-detail__status-message" role="status">
                  {statusMsg}
                </p>
              )}
            </form>
          </section>

          {/* Delete button */}
          <div>
            <button
              className="btn btn-ghost btn-sm incident-detail__delete"
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
