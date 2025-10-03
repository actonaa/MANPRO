// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../views/auth/LandingPage"; // dari dev--fahmi
import Beranda from "../views/auth/Beranda"; // dari dev--fahmi
import Dashboard from "../pages/dashboard"; // dari dev--lenida
import Aset from "../pages/kelola-aset"; // dari dev--lenida

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* route dari dev--fahmi */}
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/beranda" element={<Beranda />} />

        {/* route dari dev--lenida */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kelola-aset" element={<Aset />} />
      </Routes>
    </Router>
  );
}
