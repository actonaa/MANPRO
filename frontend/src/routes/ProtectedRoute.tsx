import { useEffect, useState, type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
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
    window.location.href = "http://localhost:5173";
    return null;
  }

  return <>{children}</>;
}

