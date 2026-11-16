import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';
import SeverityBadge from '../components/SeverityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function IncidentsPage() {
  const navigate = useNavigate();

  // All incidents from the backend
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // Search bar input (filters the list in the browser — no extra API call)
  const [search, setSearch] = useState('');

  // Load incidents when the page opens
  useEffect(() => {
    async function loadIncidents() {
      try {
        const res = await fetch('/api/incidents', { credentials: 'include' });

        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }

        const data = await res.json();
        setIncidents(data); // backend returns an array
      } catch {
        setError('Could not load incidents.');
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  // Filter incidents in memory based on what the user typed
  const filtered = incidents.filter((inc) => {
    const q = search.toLowerCase();
    return (
      inc.title.toLowerCase().includes(q) ||
      inc.incidentCode.toLowerCase().includes(q)
    );
  });

  // Delete an incident — asks for confirmation first
  async function handleDelete(e, inc) {
    e.stopPropagation(); // don't navigate to detail page when clicking Delete

    const confirmed = window.confirm(`Delete "${inc.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/incidents/${inc.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        // Remove from local list without refetching
        setIncidents((prev) => prev.filter((i) => i.id !== inc.id));
      } else {
        alert('Delete failed. Please try again.');
      }
    } catch {
      alert('Could not reach the server.');
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Incidents"
        subtitle={`${incidents.length} total`}
        action={
          <Link to="/incidents/new" className="btn btn-primary">
            + New Incident
          </Link>
        }
      />

      {/* Search bar */}
      <div style={{ marginTop: 20 }}>
        <input
          className="form-input"
          placeholder="Search by title or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {/* Loading / Error / Table */}
      <div style={{ marginTop: 16 }}>

        {loading && <p style={{ color: 'var(--ink-muted)' }}>Loading…</p>}

        {error && <p style={{ color: 'var(--severity-critical)' }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: 'var(--ink-muted)' }}>No incidents found.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="table-wrapper">
            <table className="table" aria-label="Incidents list">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Hazard</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc) => (
                  <tr
                    key={inc.id}
                    className="clickable"
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
                      {inc.incidentCode}
                    </td>
                    <td style={{ fontWeight: 500 }}>{inc.title}</td>
                    <td style={{ textTransform: 'capitalize' }}>{inc.hazardType}</td>
                    <td><SeverityBadge severity={inc.severity} /></td>
                    <td><StatusBadge status={inc.status} /></td>
                    <td style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>
                      {inc.locationName ?? '—'}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {/* stopPropagation so the row click doesn't fire when clicking Delete */}
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--severity-critical)' }}
                        onClick={(e) => handleDelete(e, inc)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
