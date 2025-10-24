// src/routes/ProtectedRouteVerifikator.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";

export function ProtectedRouteVerifikator() {
  const { checking, isAuthenticated, user } = useAuth();

  if (checking) return <p>Mengautentikasi sesi...</p>;
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  if (user.role?.role_name !== "verifikator") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
