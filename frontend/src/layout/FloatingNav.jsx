import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: 'home', end: true },
  { to: '/incidents', label: 'Incidents', icon: 'incident', end: true },
  { to: '/incidents/new', label: 'New incident', icon: 'plus' },
  { to: '/users/new', label: 'Users', icon: 'users' },
];

function NavIcon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></>,
    incident: <><path d="M12 3 21 20H3L12 3Z" /><path d="M12 9v4M12 17h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" /><circle cx="9.5" cy="7.5" r="3.5" /><path d="M17 4.5a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-3-3.87" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  };

  return (
    <svg className="floating-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function FloatingNav({ onToggleMobile }) {
  const [visible, setVisible] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollContainer = document.querySelector('.app-shell__content');
    if (!scrollContainer) return undefined;

    let previousScrollTop = scrollContainer.scrollTop;
    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop;
      if (currentScrollTop < 24) setVisible(true);
      else if (currentScrollTop < previousScrollTop - 3) setVisible(true);
      else if (currentScrollTop > previousScrollTop + 3) setVisible(false);
      previousScrollTop = currentScrollTop;
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setVisible(true), [pathname]);

  async function handleSignOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      window.location.href = '/login';
    }
  }

  return (
    <nav className={`floating-nav${visible ? ' floating-nav--visible' : ''}`} aria-label="Main navigation">
      <button className="floating-nav__mobile-menu" type="button" onClick={onToggleMobile} aria-label="Open navigation">
        <NavIcon name="menu" />
      </button>
      <div className="floating-nav__links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `floating-nav__link${isActive ? ' floating-nav__link--active' : ''}`}
            aria-label={item.label}
            title={item.label}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      <span className="floating-nav__divider" aria-hidden="true" />
      <button className="floating-nav__signout" type="button" onClick={handleSignOut} aria-label="Sign out" title="Sign out">
        <NavIcon name="logout" />
        <span>Sign out</span>
      </button>
    </nav>
  );
}
