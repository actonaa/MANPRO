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
        // decode user JSON jika dikirim dalam bentuk string
        const user = JSON.parse(decodeURIComponent(userParam));

        // simpan ke localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // tambahkan sedikit delay agar sinkron
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 200);
      } catch (err) {
        console.error("Gagal parsing user data:", err);
        window.location.href = `${import.meta.env.VITE_LINK_BACK}`;
      }
    } else {
      // jika token tidak ada, redirect ke login SSO
      window.location.href = `${import.meta.env.VITE_LINK_BACK}`;
    }
  }, [navigate]);

  return <p>Mengautentikasi...</p>;
}
