// src/routes/ProtectedRoutePegawai.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";
import LayoutDinas from "../Layout/LayoutDinas";

export function ProtectedRouteDinas() {
  const { checking, isAuthenticated, user } = useAuth();

  if (checking) return <p>Mengautentikasi sesi...</p>;
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  if (user.role !== "teknisi") {
    if (user.role == "verifikator") {
      return <Navigate to="/dashboard-verifikator" replace />;
    } else if (user.role == "auditor") {
      return <Navigate to="/dashboard-auditor" replace />;
    }
  }
  return (
    <LayoutDinas>
      <Outlet />
    </LayoutDinas>
  );
}
