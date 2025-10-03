// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../views/auth/Login";
import Dashboard from "../pages/dashboard";
import Aset from "../pages/kelola-aset";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kelola-aset" element={<Aset />} />
      </Routes>
    </Router>
  );
}
