import { NavLink } from 'react-router-dom';
// NavLink automatically adds an "active" class when you're on that page

// The nav links shown in the sidebar
const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',     icon: 'grid' },
  { to: '/incidents',     label: 'Incidents',      icon: 'alert' },
  { to: '/incidents/new', label: 'New incident',  icon: 'plus' },
  { to: '/users/new',     label: 'Create user',   icon: 'users' },
];

function NavIcon({ name }) {
  const paths = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    alert: <><path d="M12 3.5 21 20H3L12 3.5Z" /><path d="M12 9v4.5M12 17h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" /><circle cx="9.5" cy="7.5" r="3.5" /><path d="M17 4.5a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-3-3.87" /></>,
  };
  return <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Sidebar({ open, setOpen, mobileOpen, onNavigate }) {
  return (
    <aside
      className={`sidebar${open ? ' sidebar--expanded' : ''}${mobileOpen ? ' sidebar--mobile-open' : ''}`}
      aria-label="Main navigation"
      onMouseEnter={() => !mobileOpen && setOpen(true)}
      onMouseLeave={() => !mobileOpen && setOpen(false)}
      onFocusCapture={() => !mobileOpen && setOpen(true)}
      onBlurCapture={(event) => {
        if (!mobileOpen && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="sidebar__body">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 3.5 26 7v8.2c0 6.2-4.2 10.8-10 13.3C10.2 26 6 21.4 6 15.2V7l10-3.5Z" stroke="currentColor" strokeWidth="1.8"/><path d="m11.7 15.8 2.8 2.8 5.9-6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          <span className="sidebar__name">ResQGrid</span>
        </div>

        <nav aria-label="Workspace">
          <ul className="sidebar__nav" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/incidents'}
                  onClick={onNavigate}
                  aria-label={item.label}
                  title={!open && !mobileOpen ? item.label : undefined}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                  }
                >
                  <NavIcon name={item.icon} />
                  <span className="sidebar__label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <span className="sidebar__avatar" aria-hidden="true">RQ</span>
          <span className="sidebar__account"><strong>ResQGrid</strong><small>Response operations</small></span>
        </div>
      </div>
    </aside>
  );
}
