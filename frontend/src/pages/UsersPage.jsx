import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';

export default function NewUserPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // User created — go back to dashboard
        navigate('/dashboard');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || data.error?.message || 'Failed to create user.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <PageHeader title="Create User" subtitle="Add a new account" />

      {error && (
        <p style={{ color: 'var(--severity-critical)', marginTop: 12, fontSize: 'var(--text-sm)' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 480, marginTop: 24 }}>

        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-input"
            required
            placeholder="e.g. Riya Sharma"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label" htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            required
            placeholder="riya@resqgrid.local"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label" htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            required
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange}
          />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 4 }}>
            Password is hashed with bcrypt before being stored — never saved as plain text.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create User'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
