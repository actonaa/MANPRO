import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutSSO() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ Hapus token & user dari localStorage aplikasi Aset
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2️⃣ Ambil URL redirect (kalau dikirim dari SSO)
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    // 3️⃣ Kalau ada redirect → arahkan ke sana (misalnya login SSO)
    if (redirect) {
      window.location.href = redirect;
    } else {
      // Default fallback ke login aplikasi Aset
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <p>Menghapus sesi login...</p>;
}


