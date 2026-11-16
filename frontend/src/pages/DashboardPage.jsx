import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';

export default function DashboardPage() {
  // stats holds the numbers returned by the backend
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // useEffect runs once when this page loads
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard', { credentials: 'include' });

        if (res.status === 401) {
          // Not logged in → go to login
          window.location.href = '/login';
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []); // empty array = run only on first render

  return (
    <div className="page">
      <PageHeader title="Dashboard" subtitle="Operational overview" />

      {/* Loading state */}
      {loading && <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>Loading…</p>}

      {/* Error state */}
      {error && <p style={{ color: 'var(--severity-critical)', marginTop: 24 }}>{error}</p>}

      {/* Stat cards — shown once data loads */}
      {stats && (
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>

          {/* Total */}
          <div className="card" style={{ flex: 1, minWidth: 160 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>Total Incidents</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8 }}>{stats.total}</p>
          </div>

          {/* Active */}
          <div className="card" style={{ flex: 1, minWidth: 160 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>Active</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8, color: 'var(--severity-high)' }}>
              {stats.active}
            </p>
          </div>

          {/* Resolved */}
          <div className="card" style={{ flex: 1, minWidth: 160 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>Resolved</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8, color: 'var(--status-resolved)' }}>
              {stats.resolved}
            </p>
          </div>

        </div>
      )}

      {/* Quick link to incidents */}
      <div style={{ marginTop: 32 }}>
        <Link to="/incidents" className="btn btn-primary">View all incidents →</Link>
      </div>
    </div>
  );
}
