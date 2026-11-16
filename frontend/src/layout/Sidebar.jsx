import { NavLink } from 'react-router-dom';
// NavLink automatically adds an "active" class when you're on that page

// The nav links shown in the sidebar
const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',     icon: '📊' },
  { to: '/incidents',     label: 'Incidents',      icon: '🚨' },
  { to: '/incidents/new', label: '+ New Incident', icon: '➕' },
  { to: '/users/new',     label: 'Create User',    icon: '👤' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">

      {/* Logo / brand */}
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">🛡️</span>
        <span className="sidebar__name">ResQGrid</span>
      </div>

      {/* Navigation links */}
      <nav>
        <ul className="sidebar__nav" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/incidents'} // "end" so /incidents/new doesn't also highlight /incidents
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <span className="sidebar__version">ResQGrid Beta</span>
      </div>

    </aside>
  );
}
