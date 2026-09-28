import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../pages/Dashboard";
import Incidents from "../pages/Incidents";
import Map from "../pages/Map";
import Shelters from "../pages/Shelters";
import Hospitals from "../pages/Hospitals";
import RescueTeams from "../pages/RescueTeams";
import Analytics from "../pages/Analytics";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/map" element={<Map />} />
        <Route path="/shelters" element={<Shelters />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/rescue-teams" element={<RescueTeams />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}