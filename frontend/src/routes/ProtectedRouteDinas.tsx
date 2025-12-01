// src/routes/ProtectedRoutePegawai.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";
import LayoutDinas from "../Layout/LayoutDinas";

export function ProtectedRouteDinas() {
  const { checking, isAuthenticated, user } = useAuth();

  if (checking)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Mengautentikasi sesi...</p>
        </div>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  if (user.role !== "teknisi") {
    if (user.role == "verifikator") {
      return <Navigate to="/dashboard-verifikator" replace />;
    } else if (user.role == "auditor") {
      return <Navigate to="/dashboard-auditor" replace />;
    } else if (user.role == "admin_diskominfo") {
      return <Navigate to="/dashboard-admin" replace />;
    }
  }
  return (
    <LayoutDinas>
      <Outlet />
    </LayoutDinas>
  );
}
