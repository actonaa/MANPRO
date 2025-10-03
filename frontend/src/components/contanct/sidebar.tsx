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
    <div
      className={`fixed top-0 left-0 bg-white h-screen p-4 shadow-md transition-all duration-300 flex flex-col z-50 
    ${isOpen ? "w-64" : "w-20"} 
    sm:${isOpen ? "w-56" : "w-16"}  // Perkecil di mobile`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors duration-200"
        style={{ backgroundColor: activeColor }}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className="flex justify-center mb-6 mt-1">
        <img
          src={isOpen ? LogoFull : LogoSmall}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? "w-28" : "w-10"}`}
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
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center h-12 rounded-xl cursor-pointer transition-all duration-200 px-3 gap-3
                  ${isActive ? "text-white" : "text-gray-600 hover:bg-gray-100"}
                  ${!isOpen && "justify-center"}`} // center kalau icon saja
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
                  <span className="transition-all duration-300 whitespace-nowrap opacity-100">
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
          onClick={() => setActiveMenu(settingMenu.name)}
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
            <span className="transition-all duration-300 whitespace-nowrap opacity-100">
              {settingMenu.name}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
