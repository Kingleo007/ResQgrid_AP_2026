import { useLocation } from 'react-router-dom';

function pageLabel(pathname) {
  if (pathname === '/dashboard' || pathname === '/') return 'Dashboard';
  if (pathname === '/incidents') return 'Incidents';
  if (pathname === '/incidents/new') return 'New incident';
  if (pathname.startsWith('/incidents/')) return 'Incident details';
  if (pathname === '/users/new') return 'Create user';
  if (pathname === '/403') return 'Access denied';
  return 'Response operations';
}

function Icon({ name }) {
  const paths = {
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
  };

  return (
    <svg className="app-topbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function FloatingNav({ mobileOpen, onToggleMobile }) {
  const { pathname } = useLocation();

  async function handleSignOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      window.location.href = '/login';
    }
  }

  return (
    <header className="app-topbar">
      <div className="app-topbar__leading">
        <button
          className="app-topbar__menu"
          type="button"
          onClick={onToggleMobile}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} />
        </button>
        <nav className="app-topbar__context" aria-label="Breadcrumb">
          <ol>
            <li><span>ResQGrid</span></li>
            <li aria-current="page">
              <span className="app-topbar__separator" aria-hidden="true">/</span>
              <strong>{pageLabel(pathname)}</strong>
            </li>
          </ol>
        </nav>
      </div>

      <button className="app-topbar__signout" type="button" onClick={handleSignOut}>
        <Icon name="logout" />
        <span>Sign out</span>
      </button>
    </header>
  );
}
