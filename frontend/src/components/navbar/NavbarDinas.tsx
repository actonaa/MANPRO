import { useState } from "react";
import { Menu, X, Search, CircleChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function NavbarDinas() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      {/* === Navbar === */}
      <div className="fixed top-0 left-0 right-0 py-4 px-6 flex items-center justify-between bg-white shadow z-50">
        {/* Kiri: Menu / Logo */}
        <div className="flex items-center justify-between">
          {/* Tombol menu (mobile) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mt-2 text-[#475467] focus:outline-none lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo (desktop) */}
          <img
            src="/logo/logosirasa.png"
            alt="sirasa"
            className="hidden lg:block w-[140px]"
          />
        </div>

        {/* Tombol search */}
        <button className="flex items-center gap-2 px-4 py-2 w-1/2 lg:w-1/4 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 transition">
          <Search className="w-4 h-4" />
          <span className="text-sm">Cari</span>
        </button>

        {/* Profil */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="/navbar/user.png"
            alt="user"
            className="w-[35px] h-[35px] rounded-full"
          />
          <CircleChevronDown className="text-[#475467] text-xs" />
        </div>
      </div>

      {/* === Overlay untuk mobile === */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* === Sidebar === */}
      <div
        className={`fixed top-0 left-0 w-[240px] bg-white shadow-lg transition-transform duration-300 h-screen z-40
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header Sidebar (hanya mobile) */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 lg:hidden">
          <img src="/logo/LogoMobile.png" alt="sirasa" className="w-[120px]" />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Isi Sidebar */}
        <div className="p-4 space-y-4 mt-[72px] lg:mt-[88px] overflow-y-auto h-[calc(100vh-88px)]">
          {[
            {
              to: "/dashboard",
              icon: "/sidebar-icon/dashboard.png",
              label: "Dashboard",
            },
            {
              to: "/aset",
              icon: "/sidebar-icon/Aset.png",
              label: "Kelola Aset",
            },
            {
              to: "/dashboard/risiko",
              icon: "/sidebar-icon/Risk.png",
              label: "Kelola Risiko",
            },
            {
              to: "/pemeliharaan",
              icon: "/sidebar-icon/Maintenance.png",
              label: "Pemeliharaan",
            },
            {
              to: "/notifikasi",
              icon: "/sidebar-icon/Notif.png",
              label: "Notifikasi",
            },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-4 p-2 lg:p-4 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-primary hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-5 h-5 transition duration-200 ${
                      isActive
                        ? "invert brightness-0" // saat aktif → jadi putih
                        : "group-hover:invert group-hover:brightness-0" // saat hover → jadi putih
                    }`}
                  />
                  <p className="font-medium">{item.label}</p>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
