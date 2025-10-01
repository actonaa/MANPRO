// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Beranda from "../views/auth/Beranda";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/Beranda" element={<Beranda />} />
      </Routes>
    </Router>
  );
}
