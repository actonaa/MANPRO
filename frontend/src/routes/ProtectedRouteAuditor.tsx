import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ProtectedRouteBase";
import LayoutAuditor from "../Layout/LayoutAuditor";

export function ProtectedRouteAuditor() {
  const { checking, isAuthenticated, user } = useAuth();

  if (checking) return <p>Mengautentikasi sesi...</p>;
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  if (user.role?.role_name !== "auditor") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LayoutAuditor>
      <Outlet />
    </LayoutAuditor>
  );
}
