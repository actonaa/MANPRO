import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");

  const menus = [
    {
      name: "Dashboard",
      icon: "/sidebar-icon/dashboard.png",
      path: "/dashboard",
    },
    {
      name: "Kelola Aset",
      icon: "/sidebar-icon/Aset.png",
      path: "/aset",
      submenu: [
        { name: "Data Aset", path: "/aset" },
        { name: "Laporan Aset", path: "/aset/laporan" },
      ],
    },
    {
      name: "Kelola Risiko",
      icon: "/sidebar-icon/Risk.png",
      path: "/risiko",
      submenu: [
        { name: "Data Risiko", path: "/dashboard/risiko" },
        { name: "Laporan Risiko", path: "/risiko/laporan" },
      ],
    },
    {
      name: "Pemeliharaan",
      icon: "/sidebar-icon/Maintenance.png",
      path: "/pemeliharaan",
      submenu: [
        { name: "Jadwal Pemeliharaan", path: "/pemeliharaan" },
        { name: "Laporan Pemeliharaan", path: "/pemeliharaan/laporan" },
      ],
    },
    {
      name: "Notifikasi",
      icon: "/sidebar-icon/Notif.png",
      path: "/notifications",
    },
  ];

  const settingMenu = {
    name: "Back to SSO",
    icon: "/sidebar-icon/back.png",
    path: `${import.meta.env.VITE_LINK_BACK}/dashboard`,
  };

  // ✅ Buka dropdown otomatis ketika path cocok sebagian (pakai startsWith)
  useEffect(() => {
    // 🔹 Cari dropdown aktif dari path saat ini
    const activeDropdown = menus.find((menu) =>
      menu.submenu?.some((sub) => location.pathname.startsWith(sub.path))
    );

    // 🔹 Tambahan khusus: kalau buka /kelola-aset, anggap Kelola Risiko aktif
    if (location.pathname === "/kelola-risiko") {
      if (!openDropdowns.includes("Kelola Risiko")) {
        setOpenDropdowns((prev) => [...prev, "Kelola Risiko"]);
      }
      setActiveMenu("Kelola Risiko");
      return;
    }

    if (activeDropdown) {
      if (!openDropdowns.includes(activeDropdown.name)) {
        setOpenDropdowns((prev) => [...prev, activeDropdown.name]);
      }
      setActiveMenu(activeDropdown.name);
    } else {
      const currentMenu = menus.find((menu) =>
        location.pathname.startsWith(menu.path)
      );
      if (currentMenu) setActiveMenu(currentMenu.name);
    }
  }, [location.pathname]);

  const toggleDropdown = (menuName: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
    setActiveMenu(menuName);
  };

  return (
    <>
      {/* Overlay di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar utama */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 flex flex-col
          transition-all duration-300
          ${isOpen ? "w-64" : "w-20"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10 mt-3">
          <img
            src={isOpen ? "/logo/logosirasa.png" : "/logo/logo.png"}
            alt="Logo"
            className={`${
              isOpen ? "w-28" : "w-10"
            } transition-all duration-300`}
          />
        </div>

        {/* Menu utama */}
        <ul className="flex flex-col gap-2 px-2">
          {menus.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isDropdownOpen = openDropdowns.includes(item.name);
            const isActive = activeMenu === item.name;

            return (
              <li key={item.name}>
                {/* Menu utama */}
                <div
                  onClick={() => {
                    if (hasSubmenu && isOpen) {
                      toggleDropdown(item.name);
                    } else {
                      setActiveMenu(item.name);
                      navigate(item.path);
                      setOpenDropdowns([]);
                      if (window.innerWidth < 1024) toggleSidebar();
                    }
                  }}
                  className={`relative flex items-center h-12 rounded-xl cursor-pointer px-3 gap-3
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-white bg-[#007BFF]"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    ${!isOpen && "justify-center"}`}
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={`w-5 h-5 ${
                        isActive ? "brightness-0 invert" : ""
                      }`}
                    />
                  </div>

                  {/* Label + Chevron */}
                  {isOpen && (
                    <>
                      <span className="whitespace-nowrap flex-1">
                        {item.name}
                      </span>
                      {hasSubmenu && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* ✅ Submenu dengan animasi fade + slide */}
                {hasSubmenu && isOpen && (
                  <ul
                    className={`ml-3 mt-1 flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        isDropdownOpen
                          ? "max-h-[200px] opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }`}
                  >
                    {item.submenu.map((subItem) => {
                      const isSubActive =
                        location.pathname.startsWith(subItem.path) ||
                        // ✅ Tambahan khusus: aktifkan "Data Risiko" jika di /kelola-aset
                        (location.pathname === "/kelola-aset" &&
                          subItem.name === "Data Risiko");

                      return (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            onClick={() => {
                              setActiveMenu(item.name);
                              if (window.innerWidth < 1024) toggleSidebar();
                            }}
                            className={`flex items-center h-11 rounded-lg px-3 text-sm transition-all duration-200
                              ${
                                isSubActive
                                  ? "text-[#007BFF] bg-blue-50 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Menu keluar */}
        <div className="mt-auto pt-3 border-t border-gray-200 px-2">
          <div
            onClick={() => {
              if (window.innerWidth < 1024) toggleSidebar();
              const linkBack = import.meta.env.VITE_LINK_BACK;
              if (linkBack.startsWith("http")) {
                window.location.href = linkBack; // ✅ pindah ke URL dari env
              } else {
                navigate(linkBack); // ✅ jika internal route
              }
            }}
            className={`relative flex items-center h-12 rounded-xl cursor-pointer px-3 gap-3
      text-gray-600 hover:bg-gray-100
      ${!isOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src={settingMenu.icon}
                alt={settingMenu.name}
                className="w-5 h-5"
              />
            </div>
            {isOpen && (
              <span className="whitespace-nowrap">{settingMenu.name}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
