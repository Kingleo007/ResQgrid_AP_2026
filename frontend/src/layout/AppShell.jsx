//sidebar + topbar + page content area.
// Outlet = nested route pages render inside the content area.

import { Outlet, useLocation } from 'react-router-dom';
// useLocation = Current url

import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

// to show section of the app they are currently viewing
const BREADCRUMB_MAP = {
  '/dashboard': [{ label: 'Dashboard' }],
  '/incidents': [{ label: 'Incidents' }],
  '/alerts': [{ label: 'Alerts' }],
  '/map': [{ label: 'Map' }],
  '/teams': [{ label: 'Teams' }],
};


function getBreadcrumbs(pathname) {
  if (BREADCRUMB_MAP[pathname]) {
    return BREADCRUMB_MAP[pathname];
  }

  // if user is viewing a particular incident
  if (pathname.startsWith('/incidents/')) {
    return [
      { label: 'Incidents', to: '/incidents' },
      { label: 'Detail' }
    ];
  }

  // Default if nothing matches
  return [{ label: 'ResQGrid' }];
}



export default function AppShell() {
  const { pathname } = useLocation();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-shell__main">

        <TopBar breadcrumbs={breadcrumbs} />

        <main className="app-shell__content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
