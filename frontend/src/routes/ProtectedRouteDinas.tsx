// src/routes/ProtectedRoutePegawai.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";

export function ProtectedRouteDinas() {
  const { checking, isAuthenticated, user } = useAuth();

  if (checking) return <p>Mengautentikasi sesi...</p>;
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  if (user.role?.role_name !== "pegawai_opd") {
    return <Navigate to="/dashboard-verifikator" replace />;
  }

  // (opsional) Cek dinas/departemen spesifik
  if (user.department?.department_name !== "Dinas Pemuda dan Olahraga") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
