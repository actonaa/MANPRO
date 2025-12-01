import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 200);
      } catch (err) {
        console.error("Gagal parsing user data:", err);
        window.location.href = `${import.meta.env.VITE_LINK_BACK}`;
      }
    } else {
      window.location.href = `${import.meta.env.VITE_LINK_BACK}`;
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Mengautentikasi...</p>
      </div>
    </div>
  );
}
