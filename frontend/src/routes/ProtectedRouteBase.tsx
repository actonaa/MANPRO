/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// src/routes/ProtectedRouteBase.tsx
import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";

interface AuthResult {
  isAuthenticated: boolean;
  user: any | null;
  checking: boolean;
}

export function useAuth(): AuthResult {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setChecking(false);
  }, []);

  return { isAuthenticated, user, checking };
}

export function ProtectedRouteBase({ children }: { children: JSX.Element }) {
  const { checking, isAuthenticated } = useAuth();

  if (checking) return <p>Mengautentikasi sesi...</p>;
  if (!isAuthenticated) return <Navigate to="/sso/callback" replace />;

  return children;
}
