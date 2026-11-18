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
        <p className="login-error entry-form__error" role="alert">
          {error}
        </p>
      )}

      <form className="entry-form entry-form--narrow" onSubmit={handleSubmit}>

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
        <div className="form-group">
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
        <div className="form-group">
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
          <p className="entry-form__help">
            Password is hashed with bcrypt before being stored — never saved as plain text.
          </p>
        </div>

        {/* Buttons */}
        <div className="entry-form__actions">
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
