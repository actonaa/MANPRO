import { useState } from "react";
import { Link } from "react-router-dom";
import LogoFull from "../../img/logosirasa.png";
import LogoSmall from "../../img/logo.png";
import IconDashboard from "../../img/sidebar-icon/dashboard.png";
import IconAset from "../../img/sidebar-icon/Aset.png";
import IconMaintenance from "../../img/sidebar-icon/Maintenance.png";
import IconLaporan from "../../img/sidebar-icon/Laporan.png";
import IconNotif from "../../img/sidebar-icon/Notif.png";
import IconRisk from "../../img/sidebar-icon/Risk.png";
import IconSetting from "../../img/sidebar-icon/Setting.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menus = [
    { name: "Dashboard", icon: IconDashboard, path: "/dashboard" },
    { name: "Kelola Aset", icon: IconAset, path: "/kelola-aset" },
    { name: "Pemeliharaan", icon: IconMaintenance, path: "/pemeliharaan" },
    { name: "Laporan", icon: IconLaporan, path: "/laporan" },
    { name: "Notifikasi", icon: IconNotif, path: "/notifikasi" },
    { name: "Manajemen Risiko", icon: IconRisk, path: "/manajemen-risiko" },
  ];

  const settingMenu = {
    name: "Pengaturan",
    icon: IconSetting,
    path: "/pengaturan",
  };

  const activeColor = "#00A9FF";

  return (
    <>
      {/* ✅ Overlay background ketika sidebar terbuka di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* ✅ Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 flex flex-col transition-all duration-300
        ${isOpen ? "w-64" : "w-20"} 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6 mt-3">
          <img
            src={isOpen ? LogoFull : LogoSmall}
            alt="Logo"
            className={`transition-all duration-300 ${
              isOpen ? "w-28" : "w-10"
            }`}
          />
        </div>

        {/* Menu Utama */}
        <ul className="flex flex-col gap-2">
          {menus.map((item) => {
            const isActive = activeMenu === item.name;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setActiveMenu(item.name);
                    if (window.innerWidth < 1024) toggleSidebar(); // tutup sidebar setelah klik di mobile
                  }}
                  className={`flex items-center h-12 rounded-xl cursor-pointer transition-all duration-200 px-3 gap-3
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    ${!isOpen && "justify-center"}`}
                  style={isActive ? { backgroundColor: activeColor } : {}}
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
                  {isOpen && (
                    <span className="transition-all duration-300 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Menu Pengaturan */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <Link
            to={settingMenu.path}
            onClick={() => {
              setActiveMenu(settingMenu.name);
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className={`flex items-center h-12 rounded-xl cursor-pointer transition-all duration-200 px-3 gap-3
              ${
                activeMenu === settingMenu.name
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }
              ${!isOpen && "justify-center"}`}
            style={
              activeMenu === settingMenu.name
                ? { backgroundColor: activeColor }
                : {}
            }
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src={settingMenu.icon}
                alt={settingMenu.name}
                className={`w-5 h-5 ${
                  activeMenu === settingMenu.name ? "brightness-0 invert" : ""
                }`}
              />
            </div>
            {isOpen && (
              <span className="transition-all duration-300 whitespace-nowrap">
                {settingMenu.name}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
