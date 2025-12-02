/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

interface NotificationItem {
  id: string;
  message: string;
  is_read: boolean;
  category: string;
  // tambah field lain jika perlu
}

export default function NavbarDiskominfo() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // === Tambahan Notifikasi ===
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<NotificationItem[]>(
          "https://asset-risk-management.vercel.app/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data; // sudah aman, bukan unknown

        const unread = data.filter(
          (item: any) => item.is_read === false
        ).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Gagal mengambil notifikasi:", err);
      }
    };

    fetchNotifications();
  }, []);

  // === Data sidebar utama ===
  const sidebarItems = [
    {
      label: "Dashboard",
      icon: "/sidebar-icon/dashboard.png",
      to: "/dashboard-admin",
    },
    {
      label: "Kelola Aset",
      icon: "/sidebar-icon/Aset.png",
      children: [
        { label: "Data Aset", to: "/aset-admin" },
        { label: "Data SDM", to: "/sdm/aset-admin" },
        { label: "Verifikasi Penghapusan", to: "/Verikasi/aset-admin" },
      ],
    },
    {
      label: "Kelola Risiko",
      icon: "/sidebar-icon/Risk.png",
      children: [{ label: "Data Risiko", to: "/risiko-admin" }],
    },
    {
      label: "Laporan",
      icon: "/sidebar-icon/Laporan.png",
      children: [
        { label: "Laporan Aset", to: "/laporan/aset-admin" },
        { label: "Laporan SDM", to: "/laporan/sdm-admin" },
        { label: "Laporan Risiko", to: "/laporan/risiko-admin" },
        { label: "Laporan Pemeliharaan", to: "/laporan/pemeliharaan-admin" },
        { label: "Laporan Audit", to: "/laporan/audit-admin" },
      ],
    },
    {
      label: "Notifikasi",
      icon: "/sidebar-icon/Notif.png",
      to: "/notifikasi/notifikasi-admin",
    },
    {
      label: "Kelola Pengguna",
      icon: "/sidebar-icon/Kelola Pengguna.png",
      to: "/kelolapengguna-admin",
    },
    {
      label: "Hasil Audit",
      icon: "/sidebar-icon/Hasil Audit.png",
      to: "/hasilaudit-admin",
    },
    {
      label: "Audit Trail",
      icon: "/sidebar-icon/Audit Trail.png",
      to: "/audit-admin",
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleNavClick = () => {
    setOpenDropdown(null);
    setIsSidebarOpen(false);
  };

  // === Ambil data user ===
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  return (
    <div>
      {/* === Navbar Atas === */}
      <div className="fixed top-0 left-0 right-0 py-4 px-6 flex items-center justify-between bg-white shadow z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mt-2 text-[#475467] focus:outline-none lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <img
          src="/logo/logosirasa.png"
          alt="sirasa"
          className="hidden lg:block w-[140px]"
        />

        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="/navbar/user.png"
            alt="user"
            className="w-[35px] h-[35px] rounded-full"
          />
          <div className="text-xs">
            <p className="font-semibold text-slate-900">
              {user?.name} ({user?.role})
            </p>
            <p className="font-light text-slate-900">{user?.department}</p>
          </div>
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
        className={`fixed top-0 left-0 w-[240px] bg-white shadow-lg transition-transform duration-300 whitespace-nowrap h-screen z-60 lg:z-40
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Sidebar Mobile Header */}
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
        <div className="flex flex-col justify-between h-[calc(100vh-88px)] lg:mt-[88px]">
          {/* Menu atas */}
          <div className="p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isOpen =
                openDropdown === item.label ||
                (item.children &&
                  item.children.some((sub) =>
                    location.pathname.startsWith(sub.to)
                  ));

              // ==== ITEM DENGAN CHILDREN ====
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
                          className={`w-5 h-5 ${
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

                    {/* Submenu */}
                    {isOpen && (
                      <div className="mt-1 flex flex-col space-y-1">
                        {item.children.map((sub) => (
                          <NavLink
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                              `block px-3 py-4 rounded-xl text-sm font-medium transition ${
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

              // ==== ITEM TANPA CHILDREN (Termasuk Notifikasi) ====
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => handleNavClick()}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 p-4 rounded-xl transition ${
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
                        className={`w-5 h-5 ${
                          isActive
                            ? "invert brightness-0"
                            : "group-hover:invert group-hover:brightness-0"
                        }`}
                      />

                      <p className="font-medium">{item.label}</p>

                      {/* Badge Notifikasi */}
                      {item.label === "Notifikasi" && unreadCount > 0 && (
                        <span className="absolute right-4 top-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Tombol Logout */}
          <div className="p-4 border-t border-gray-200">
            <a
              href="https://fe-sso.vercel.app"
              className="flex items-center gap-4 p-4 rounded-xl text-slate-500 hover:bg-red-500 hover:text-white transition"
            >
              <LogOut className="w-5 h-5" />
              <p className="font-medium">Keluar Aplikasi</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
