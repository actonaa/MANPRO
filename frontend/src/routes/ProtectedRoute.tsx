import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setChecking(false);
  }, []);

  if (checking) {
    return <p>Mengautentikasi sesi...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sso/callback" replace />; // bisa diarahkan ke halaman login SSO kamu
  }

  return <Outlet />; // 🔥 di sinilah semua child route akan di-render
}
