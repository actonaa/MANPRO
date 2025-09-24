// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../views/auth/LandingPage";
import Beranda from "../views/auth/Beranda";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/Beranda" element={<Beranda />} />
      </Routes>
    </Router>
  );
}
