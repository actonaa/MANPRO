// src/routes/ProtectedRouteVerifikator.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";
import LayoutVerifikator from "../Layout/LayoutVerifikator";

export function ProtectedRouteVerifikator() {
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

  if (user.role !== "verifikator") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LayoutVerifikator>
      <Outlet />
    </LayoutVerifikator>
  );
}
