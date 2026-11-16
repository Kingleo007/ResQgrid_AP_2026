// frontend/src/pages/AccessDenied.jsx
// 403 page shown when a user lacks the required role.

import { Link } from 'react-router-dom';

/** Rendered when the authenticated user's role doesn't allow access. */
export default function AccessDenied() {
  return (
    <div className="error-page">
      <span className="error-page__code">403</span>
      <h1 className="error-page__title">Access denied</h1>
      <p className="error-page__message">
        You don't have permission to view this page.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
