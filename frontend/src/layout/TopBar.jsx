import { Link } from 'react-router-dom';
// TopBar shows breadcrumbs (where you are) and a logout button

export default function TopBar({ breadcrumbs = [] }) {

  // Called when the user clicks "Logout"
  async function handleLogout() {
    // Tell the backend to clear the session cookie
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // send the cookie so the server knows who to log out
    });
    // Redirect to login page (hard redirect, clears all React state)
    window.location.href = '/login';
  }

  return (
    <header className="topbar" role="banner">

      {/* Breadcrumb trail — e.g. Home > Incidents > Detail */}
      <nav className="topbar__breadcrumb" aria-label="Breadcrumb">
        <ol>
          {breadcrumbs.map((crumb, i) => (
            <li key={i}>
              {/* If a destination exists, make it a clickable link */}
              {crumb.to ? (
                <Link to={crumb.to}>{crumb.label}</Link>
              ) : (
                // Last item is just text, not a link
                <span aria-current={i === breadcrumbs.length - 1 ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Logout button — always visible */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={handleLogout}
        style={{ marginLeft: 'auto' }}
      >
        Logout
      </button>

    </header>
  );
}
