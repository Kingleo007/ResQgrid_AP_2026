// frontend/src/pages/NotFound.jsx
// 404 page shown for unmatched routes.

import { Link } from 'react-router-dom';

/** Rendered when no route matches the current URL. */
export default function NotFound() {
  return (
    <div className="error-page">
      <span className="error-page__code">404</span>
      <h1 className="error-page__title">Page not found</h1>
      <p className="error-page__message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
