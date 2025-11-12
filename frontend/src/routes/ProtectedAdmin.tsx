// src/routes/ProtectedRoutePegawai.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";
import LayoutAdmin from "../Layout/LayoutAdmin";

export function ProtectedRouteAdmin() {
  const { checking, isAuthenticated, user } = useAuth();

  if (checking) return <p>Mengautentikasi sesi...</p>;
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  if (user.role !== "admin_diskominfo") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <LayoutAdmin>
      <Outlet />
    </LayoutAdmin>
  );
}
