import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';
import SeverityBadge from '../components/SeverityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatRelative } from '../utils/format.js';

const SEVERITY_RANK = { critical: 0, high: 1, moderate: 2, low: 3 };

function sortValue(incident, key) {
  if (key === 'severity') return SEVERITY_RANK[String(incident.severity || '').toLowerCase()] ?? 4;
  if (key === 'updatedAt') return Date.parse(incident.updatedAt || incident.createdAt || '') || 0;
  return String(incident[key] || '').toLocaleLowerCase('en-IN');
}

function SortHeading({ label, column, sort, onSort }) {
  const active = sort.key === column;
  return (
    <button
      className="table-sort-button"
      type="button"
      onClick={() => onSort(column)}
      aria-label={`Sort by ${label}${active ? `, currently ${sort.direction === 'asc' ? 'ascending' : 'descending'}` : ''}`}
    >
      <span>{label}</span>
      <svg className={`table-sort-button__icon${active ? ' table-sort-button__icon--active' : ''}`} viewBox="0 0 12 14" fill="none" aria-hidden="true">
        {active
          ? <path d={sort.direction === 'asc' ? 'm3 9 3-3 3 3' : 'm3 5 3 3 3-3'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="m3 5 3-3 3 3M3 9l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </button>
  );
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'severity', direction: 'asc' });

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
        setError('Could not load incidents. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const visibleIncidents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en-IN');
    const matching = incidents.filter((incident) => (
      `${incident.title || ''} ${incident.incidentCode || ''} ${incident.locationName || ''}`
        .toLocaleLowerCase('en-IN')
        .includes(query)
    ));

    return matching.sort((left, right) => {
      const leftValue = sortValue(left, sort.key);
      const rightValue = sortValue(right, sort.key);
      const comparison = typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : leftValue.localeCompare(rightValue, 'en-IN', { numeric: true, sensitivity: 'base' });
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [incidents, search, sort]);

  function handleSort(key) {
    setSort((current) => current.key === key
      ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' });
  }

  async function handleDelete(event, incident) {
    event.stopPropagation();
    const confirmed = window.confirm(`Delete "${incident.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) setIncidents((current) => current.filter((item) => item.id !== incident.id));
      else window.alert('Delete failed. Please try again.');
    } catch {
      window.alert('Could not reach the server. Please try again.');
    }
  }

  return (
    <div className="page incidents-page">
      <PageHeader
        title="Incidents"
        subtitle={`${incidents.length} ${incidents.length === 1 ? 'incident' : 'incidents'}`}
        action={(
          <Link to="/incidents/new" className="btn btn-primary">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M10 4v12M4 10h12" />
            </svg>
            New incident
          </Link>
        )}
      />

      <div className="incident-register__toolbar">
        <label className="incident-search">
          <span className="incident-search__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.2 4.2" />
            </svg>
          </span>
          <span className="sr-only">Search incidents by title, code, or location</span>
          <input
            className="form-input"
            type="search"
            placeholder="Search incidents by title, code, or location"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <p className="incident-register__count" aria-live="polite">
          {loading ? 'Loading register…' : `${visibleIncidents.length} shown`}
        </p>
      </div>

      {loading && (
        <div className="incident-register__message" role="status">Loading incidents…</div>
      )}

      {!loading && error && (
        <div className="incident-register__message incident-register__message--error" role="alert">{error}</div>
      )}

      {!loading && !error && visibleIncidents.length === 0 && (
        <div className="incident-register__empty" role="status">
          <strong>{search ? 'No matching incidents' : 'No incidents recorded'}</strong>
          <p>{search ? 'Try a different title, incident code, or location.' : 'New incident reports will appear here.'}</p>
        </div>
      )}

      {!loading && !error && visibleIncidents.length > 0 && (
        <div className="table-wrapper incident-register__table-wrapper">
          <table className="table incident-table" aria-label="Incidents register">
            <thead>
              <tr>
                <th scope="col" aria-sort={sort.key === 'incidentCode' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Code" column="incidentCode" sort={sort} onSort={handleSort} /></th>
                <th scope="col" aria-sort={sort.key === 'title' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Incident" column="title" sort={sort} onSort={handleSort} /></th>
                <th scope="col" aria-sort={sort.key === 'hazardType' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Hazard" column="hazardType" sort={sort} onSort={handleSort} /></th>
                <th scope="col" aria-sort={sort.key === 'severity' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Severity" column="severity" sort={sort} onSort={handleSort} /></th>
                <th scope="col" aria-sort={sort.key === 'status' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Status" column="status" sort={sort} onSort={handleSort} /></th>
                <th scope="col" aria-sort={sort.key === 'locationName' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Location" column="locationName" sort={sort} onSort={handleSort} /></th>
                <th scope="col" aria-sort={sort.key === 'updatedAt' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><SortHeading label="Updated" column="updatedAt" sort={sort} onSort={handleSort} /></th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleIncidents.map((incident) => (
                <tr key={incident.id}>
                  <td data-label="Code"><span className="incident-table__code">{incident.incidentCode}</span></td>
                  <td data-label="Incident"><Link className="incident-table__title" to={`/incidents/${incident.id}`}>{incident.title}</Link></td>
                  <td data-label="Hazard"><span className="incident-table__hazard">{incident.hazardType}</span></td>
                  <td data-label="Severity"><SeverityBadge severity={incident.severity} /></td>
                  <td data-label="Status"><StatusBadge status={incident.status} /></td>
                  <td data-label="Location" className="incident-table__location">{incident.locationName || '—'}</td>
                  <td data-label="Updated"><time dateTime={incident.updatedAt || incident.createdAt || undefined}>{formatRelative(incident.updatedAt || incident.createdAt)}</time></td>
                  <td data-label="Actions" className="incident-table__actions">
                    <button className="btn btn-ghost btn-sm incident-table__delete" type="button" onClick={(event) => handleDelete(event, incident)}>
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
  );
}
