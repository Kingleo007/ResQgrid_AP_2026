import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';
import IndiaIncidentMap from '../components/IndiaIncidentMap.jsx';
import SeverityBadge from '../components/SeverityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatRelative } from '../utils/format.js';

const SEVERITY_RANK = { critical: 0, high: 1, moderate: 2, low: 3 };

function lastUpdated(incident) {
  return Date.parse(incident.updatedAt || incident.createdAt || '') || 0;
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [incidentsError, setIncidentsError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard', { credentials: 'include' });

        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!res.ok) throw new Error('Dashboard request failed');
        setStats(await res.json());
      } catch {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const res = await fetch('/api/incidents', { credentials: 'include' });
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (!res.ok) throw new Error('Incident request failed');
        const data = await res.json();
        setIncidents(Array.isArray(data) ? data : []);
      } catch {
        setIncidentsError('Could not load incident locations.');
      } finally {
        setIncidentsLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const urgentIncidents = useMemo(() => incidents
    .filter((incident) => {
      const severity = String(incident.severity || '').toLowerCase();
      const status = String(incident.status || '').toLowerCase();
      return ['critical', 'high'].includes(severity) && !['resolved', 'closed'].includes(status);
    })
    .sort((left, right) => {
      const leftRank = SEVERITY_RANK[String(left.severity || '').toLowerCase()] ?? 4;
      const rightRank = SEVERITY_RANK[String(right.severity || '').toLowerCase()] ?? 4;
      return leftRank - rightRank || lastUpdated(right) - lastUpdated(left);
    })
    .slice(0, 6), [incidents]);

  return (
    <div className="page dashboard-page">
      <PageHeader title="Dashboard" subtitle="Operational overview" />

      <section className="priority-section" aria-labelledby="priority-title">
        <div className="section-heading">
          <div>
            <h2 id="priority-title">Priority incidents</h2>
            <p>Open critical and high-severity reports</p>
          </div>
          <Link to="/incidents" className="text-link">View all incidents <span aria-hidden="true">→</span></Link>
        </div>

        {incidentsLoading && (
          <div className="priority-message" role="status">Loading priority incidents…</div>
        )}

        {!incidentsLoading && incidentsError && (
          <div className="priority-message priority-message--error" role="alert">{incidentsError}</div>
        )}

        {!incidentsLoading && !incidentsError && urgentIncidents.length === 0 && (
          <div className="priority-empty" role="status">
            <span className="priority-empty__mark" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 10 3.2 3.2L15 6.5" />
              </svg>
            </span>
            <div>
              <strong>No open critical or high-severity incidents</strong>
              <p>All incident reports remain available in the incidents register.</p>
            </div>
          </div>
        )}

        {!incidentsLoading && !incidentsError && urgentIncidents.length > 0 && (
          <div className="priority-table-wrapper">
            <table className="priority-table" aria-label="Open critical and high-severity incidents">
              <thead>
                <tr>
                  <th scope="col">Severity</th>
                  <th scope="col">Incident</th>
                  <th scope="col">Status</th>
                  <th scope="col">Location</th>
                  <th scope="col">Last updated</th>
                </tr>
              </thead>
              <tbody>
                {urgentIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td data-label="Severity"><SeverityBadge severity={incident.severity} /></td>
                    <td data-label="Incident">
                      <Link className="priority-table__title" to={`/incidents/${incident.id}`}>
                        {incident.title}
                      </Link>
                      <span className="priority-table__code">{incident.incidentCode}</span>
                    </td>
                    <td data-label="Status"><StatusBadge status={incident.status} /></td>
                    <td data-label="Location">{incident.locationName || '—'}</td>
                    <td data-label="Last updated" className="priority-table__updated">
                      <time dateTime={incident.updatedAt || incident.createdAt || undefined}>
                        {formatRelative(incident.updatedAt || incident.createdAt)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {error && <p className="inline-message inline-message--error" role="alert">{error}</p>}

      {stats && (
        <section className="dashboard-summary" aria-label="Incident totals">
          <div className="dashboard-summary__item">
            <span>Total incidents</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="dashboard-summary__item dashboard-summary__item--active">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="dashboard-summary__item dashboard-summary__item--resolved">
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>
          {loading && <span className="sr-only" role="status">Loading dashboard totals…</span>}
        </section>
      )}

      {loading && !stats && (
        <p className="inline-message dashboard-summary__loading" role="status">Loading dashboard totals…</p>
      )}

      <IndiaIncidentMap
        incidents={incidents}
        loading={incidentsLoading}
        error={incidentsError}
      />
    </div>
  );
}
