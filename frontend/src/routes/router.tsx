// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/dinas/Dashboard";
// import KelolaAset from "../views/dinas/KelolaAset";
import KelolaAsetDua from "../views/dinas/KelolaAsetDua";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/aset" element={<KelolaAset />} /> */}
        <Route path="/asetdua" element={<KelolaAsetDua />} />
      </Routes>
    </Router>
  );
}
