//sidebar + topbar + page content area.
// Outlet = nested route pages render inside the content area.

import { Outlet } from 'react-router-dom';
import { useState } from 'react';

import Sidebar from './Sidebar.jsx';
import FloatingNav from './FloatingNav.jsx';

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app-shell${mobileOpen ? ' app-shell--mobile-open' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />

      <div className="app-shell__main">
        <FloatingNav
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((value) => !value)}
        />

        {mobileOpen && <button className="app-shell__scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

        <main className="app-shell__content" id="main-content" tabIndex="-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
