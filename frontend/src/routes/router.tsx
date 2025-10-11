// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/views/Dashboard";
import KelolaAset from "../views/views/KelolaAset";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kelola-aset" element={<KelolaAset />} />
      </Routes>
    </Router>
  );
}
