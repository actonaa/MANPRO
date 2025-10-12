import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/navigator/dinas/header";
import Sidebar from "../../components/navigator/dinas/sidebar";

export default function LayoutDinas({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation(); // 🔁 deteksi perubahan route

  // Toggle sidebar hanya aktif di mobile
  const toggleSidebar = () => {
    if (!isDesktop) setIsSidebarOpen((prev) => !prev);
  };

  // 📱 Deteksi ukuran layar
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop); // buka otomatis di desktop
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🚫 Hapus animasi sidebar setiap kali berpindah route (biar fix)
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true); // pastikan sidebar selalu terbuka
    }
  }, [location, isDesktop]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* 🧭 Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 🧩 Konten utama */}
      <div
        className={`${
          isDesktop
            ? "lg:ml-64" // Sidebar fix tanpa animasi
            : "transition-all duration-300" // Animasi hanya di mobile
        }`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSearchChange={(value) => console.log(value)}
        />

        <main className="px-6 py-6 mt-14 sm:mt-16">{children}</main>
      </div>
    </div>
  );
}
