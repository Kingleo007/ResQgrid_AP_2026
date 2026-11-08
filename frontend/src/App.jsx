import { Routes, Route, Navigate } from 'react-router-dom';
// Holds routes, redirects

// layout for sidebar , topbar , main
import AppShell from './layout/AppShell.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import IncidentsPage from './pages/IncidentsPage.jsx';
import IncidentDetailPage from './pages/IncidentDetailPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AccessDenied from './pages/AccessDenied.jsx';

function App() {
  return (
    <Routes>



    </Routes>
  );
}

export default App;
