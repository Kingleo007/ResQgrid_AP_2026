//sidebar + topbar + page content area.
// Outlet = nested route pages render inside the content area.

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
// useLocation = Current url

import Sidebar from './Sidebar.jsx';
import FloatingNav from './FloatingNav.jsx';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app-shell${mobileOpen ? ' app-shell--mobile-open' : ''}`}>
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="app-shell__main">

        <FloatingNav onToggleMobile={() => setMobileOpen((value) => !value)} />

        {mobileOpen && <button className="app-shell__scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

        <main className="app-shell__content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
