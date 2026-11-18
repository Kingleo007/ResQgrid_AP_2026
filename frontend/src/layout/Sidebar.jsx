import { NavLink, useLocation } from 'react-router-dom';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
      { to: '/incidents', label: 'Incidents', icon: 'alert' },
      { to: '/incidents/new', label: 'New incident', icon: 'plus' },
    ],
  },
  {
    label: 'Administration',
    items: [{ to: '/users/new', label: 'Create user', icon: 'users' }],
  },
];

function NavIcon({ name }) {
  const paths = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
    alert: <><path d="M12 3.5 21 20H3L12 3.5Z" /><path d="M12 9v4.5M12 17h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" /><circle cx="9.5" cy="7.5" r="3.5" /><path d="M17 4.5a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-3-3.87" /></>,
  };

  return (
    <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function Sidebar({ mobileOpen, onNavigate }) {
  const { pathname } = useLocation();

  function isCurrentPage(path, isActive) {
    if (path === '/incidents') {
      return pathname === '/incidents' || (pathname.startsWith('/incidents/') && pathname !== '/incidents/new');
    }
    return isActive || pathname === path;
  }

  return (
    <aside
      id="primary-navigation"
      className={`sidebar${mobileOpen ? ' sidebar--mobile-open' : ''}`}
      aria-label="Primary navigation"
    >
      <div className="sidebar__body">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none"><path d="M16 3.5 26 7v8.2c0 6.2-4.2 10.8-10 13.3C10.2 26 6 21.4 6 15.2V7l10-3.5Z" stroke="currentColor" strokeWidth="1.8" /><path d="m11.7 15.8 2.8 2.8 5.9-6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span className="sidebar__brand-copy">
            <strong className="sidebar__name">ResQGrid</strong>
            <span className="sidebar__tagline">Response operations</span>
          </span>
        </div>

        <nav className="sidebar__navigation" aria-label="Workspace">
          {NAV_GROUPS.map((group) => (
            <section className="sidebar__group" key={group.label} aria-label={group.label}>
              <h2 className="sidebar__group-title">{group.label}</h2>
              <ul className="sidebar__nav" role="list">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard' || item.to === '/incidents' || item.to === '/users/new'}
                      onClick={onNavigate}
                      className={({ isActive }) => `sidebar__link${isCurrentPage(item.to, isActive) ? ' sidebar__link--active' : ''}`}
                      aria-current={isCurrentPage(item.to, false) ? 'page' : undefined}
                    >
                      <NavIcon name={item.icon} />
                      <span className="sidebar__label">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <div className="sidebar__footer" aria-hidden="true">
          <span className="sidebar__footer-mark"><i /><i /><i /></span>
          <span>ResQGrid</span>
        </div>
      </div>
    </aside>
  );
}
