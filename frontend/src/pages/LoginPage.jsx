import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  // Form field values
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [error, setError]     = useState('');   // error message to show
  const [loading, setLoading] = useState(false); // disable button while fetching

  async function handleSubmit(e) {
    e.preventDefault();   // stop the browser from reloading the page
    setError('');         // clear any previous error
    setLoading(true);

    try {
      // POST to backend — sends email + password as JSON
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // needed so the browser stores the session cookie
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Backend returned 200 → login success → go to dashboard
        navigate('/dashboard');
      } else {
        // Backend returned 401 or similar → show error
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Invalid email or password.');
      }
    } catch {
      // Network error (backend is down, no internet, etc.)
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand */}
        <div className="login-card__brand">
          <span className="login-card__logo" aria-hidden="true">🛡️</span>
          <h1 className="login-card__title">ResQGrid</h1>
          <p className="login-card__subtitle">Disaster Response Administration</p>
        </div>

        {/* Error message (only shown if login fails) */}
        {error && (
          <p style={{ color: 'var(--severity-critical)', marginBottom: 12, fontSize: 'var(--text-sm)' }}>
            {error}
          </p>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              autoComplete="email"
              autoFocus
              required
              placeholder="admin@resqgrid.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // update state on every keystroke
            />
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
            disabled={loading} // can't click again while request is in flight
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

        </form>

        <p className="login-card__hint">Gov-only system. Authorised personnel only.</p>

      </div>
    </div>
  );
}
