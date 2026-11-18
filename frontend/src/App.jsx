import { Routes, Route, Navigate } from 'react-router-dom';
// Holds all routes and redirects

import AppShell from './layout/AppShell.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import IncidentsPage from './pages/IncidentsPage.jsx';
import IncidentDetailPage from './pages/IncidentDetailPage.jsx';
import NewIncidentPage from './pages/NewIncidentPage.jsx';
import NewUserPage from './pages/UsersPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AccessDenied from './pages/AccessDenied.jsx';

function App() {
  return (
    <Routes>

      {/* Login page — public, no layout wrapper */}
      <Route path="/login" element={<LoginPage />} />

      {/* All other pages use the app shell (sidebar + floating navigation) */}
      <Route path="/" element={<AppShell />}>

        {/* Redirect root → dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="incidents/new" element={<NewIncidentPage />} />
        <Route path="incidents/:id" element={<IncidentDetailPage />} />

        <Route path="users/new" element={<NewUserPage />} />

        <Route path="403" element={<AccessDenied />} />

      </Route>

      {/* Unknown URLs */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
