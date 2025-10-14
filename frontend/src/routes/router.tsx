// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/dinas/Dashboard";
import KelolaAset from "../views/dinas/KelolaAset";
import AsetTambah from "../views/dinas/Aset/Tambah";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aset" element={<KelolaAset />} />
        <Route path="/aset/tambah" element={<AsetTambah />} />
      </Routes>
    </Router>
  );
}
