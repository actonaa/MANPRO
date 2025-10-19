import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/dinas/Dashboard";
import KelolaAset from "../views/dinas/KelolaAset";
import Callback from "../sso/callback";
import LogoutSSO from "../sso/logout";
import { ProtectedRoute } from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ✅ route callback tidak diproteksi */}
        <Route path="/sso/callback" element={<Callback />} />
        <Route path="/sso/logout" element={<LogoutSSO />} />

        {/* ✅ route berikut hanya bisa diakses jika token ada */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aset"
          element={
            <ProtectedRoute>
              <KelolaAset />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}