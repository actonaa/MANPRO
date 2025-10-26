import { useState } from "react";
import {
  Menu,
  X,
  Search,
  CircleChevronDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export default function NavbarDinas() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // dropdown aktif

  // === Data sidebar utama ===
  const sidebarItems = [
    {
      label: "Dashboard",
      icon: "/sidebar-icon/dashboard.png",
      to: "/dashboard",
    },
    {
      label: "Kelola Aset",
      icon: "/sidebar-icon/Aset.png",
      children: [
        { label: "Data Aset", to: "/aset" },
        { label: "Laporan Aset", to: "/laporan/aset" },
      ],
    },
    {
      label: "Kelola Risiko",
      icon: "/sidebar-icon/Risk.png",
      children: [
        { label: "Data Risiko", to: "/risiko" },
        { label: "Laporan Risiko", to: "/laporan/risiko" },
      ],
    },
    {
      label: "Pemeliharaan",
      icon: "/sidebar-icon/Maintenance.png",
      children: [
        { label: "Jadwal Pemeliharaan", to: "/pemeliharaan" },
        { label: "Laporan Pemeliharaan", to: "/laporan/pemeliharaan" },
      ],
    },
    {
      label: "Notifikasi",
      icon: "/sidebar-icon/Notif.png",
      to: "/notifikasi",
    },
  ];

  // === Toggle dropdown ===
  const toggleDropdown = (label: string) => {
    // Jika klik dropdown yang sama → tutup
    // Jika klik dropdown lain → buka dropdown itu & tutup lainnya
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  // === Klik menu biasa (tanpa dropdown) → tutup semua dropdown ===
  const handleNavClick = () => {
    setOpenDropdown(null);
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {/* === Navbar Atas === */}
      <div className="fixed top-0 left-0 right-0 py-4 px-6 flex items-center justify-between bg-white shadow z-50">
        {/* Tombol menu (mobile) */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mt-2 text-[#475467] focus:outline-none lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <img
          src="/logo/logosirasa.png"
          alt="sirasa"
          className="hidden lg:block w-[140px]"
        />

        {/* Search */}
        <button className="flex items-center gap-2 px-4 py-2 w-1/2 lg:w-1/4 lg:-ml-130 xl:-ml-160 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 transition">
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

      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* === Sidebar === */}
      <div
        className={`fixed top-0 left-0 w-[240px] bg-white shadow-lg transition-transform duration-300 h-screen z-60 lg:z-40
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Header Sidebar (mobile) */}
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
        <div className="p-4 space-y-2 lg:mt-[88px] overflow-y-auto h-[calc(100vh-88px)]">
          {sidebarItems.map((item) => {
            const isOpen =
              openDropdown === item.label ||
              (item.children &&
                item.children.some((sub) =>
                  location.pathname.startsWith(sub.to)
                ));

            // === Jika item punya dropdown ===
            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`group w-full flex items-center justify-between gap-3 p-4 rounded-xl transition duration-200 text-left ${
                      isOpen
                        ? "bg-blue-500 text-white"
                        : "text-slate-500 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={`w-5 h-5 transition duration-200 ${
                          isOpen
                            ? "invert brightness-0"
                            : "group-hover:invert group-hover:brightness-0"
                        }`}
                      />
                      <p className="font-medium">{item.label}</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* === Submenu === */}
                  {isOpen && (
                    <div className="mt-1 flex flex-col space-y-1">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          // Jangan tutup sidebar/dropdown saat klik submenu
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-4 rounded-xl text-sm font-medium transition duration-200 ${
                              isActive
                                ? "bg-blue-100 text-blue-500"
                                : "text-slate-500 hover:bg-blue-500 hover:text-white"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // === Jika bukan dropdown ===
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => handleNavClick()}
                className={({ isActive }) =>
                  `group flex items-center gap-4 p-4 rounded-xl transition duration-200 ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-slate-500 hover:bg-blue-500 hover:text-white"
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
                          ? "invert brightness-0"
                          : "group-hover:invert group-hover:brightness-0"
                      }`}
                    />
                    <p className="font-medium">{item.label}</p>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
