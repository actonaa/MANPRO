import { Link } from "react-router-dom";
import { useState } from "react";
import LogoFull from "../../img/logosirasa.png";
import LogoSmall from "../../img/logo.png";
import IconDashboard from "../../img/sidebar-icon/dashboard.png";
import IconAset from "../../img/sidebar-icon/Aset.png";
import IconMaintenance from "../../img/sidebar-icon/Maintenance.png";
import IconLaporan from "../../img/sidebar-icon/Laporan.png";
import IconNotif from "../../img/sidebar-icon/Notif.png";
import IconRisk from "../../img/sidebar-icon/Risk.png";
import IconSetting from "../../img/sidebar-icon/Setting.png";

// 🧩 Sidebar menerima props dari Layout
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

  return (

    <div
      className={`fixed top-0 left-0 bg-white h-screen shadow-md flex flex-col z-50 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* 🔘 Tombol Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-9 text-white p-1 rounded-full transition-colors duration-200"
        style={{ backgroundColor: "#00A9FF" }}
      >
        {isOpen ? (
          // ❌ Ikon “close”
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
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
          // ☰ Ikon “menu”
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
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

      {/* 🏷 Logo */}
      <div className="flex justify-center mb-4 mt-1">
        <img
          src={isOpen ? LogoFull : LogoSmall}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? "w-28" : "w-10"}`}
        />
      </div>

      {/* 📋 Menu Utama */}
      <ul className="flex flex-col gap-3 px-3">
        {menus.map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isActive ? "text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: isActive ? "#00A9FF" : "transparent",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`min-w-[22px] min-h-[22px] w-6 h-6 transition-all duration-200 ${
                    isActive ? "brightness-0 invert" : ""
                  }`}
                />
                <span
                  className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                    isOpen ? "ml-2 opacity-100" : "ml-0 opacity-0 w-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ⚙️ Menu Pengaturan */}
      <div className="mt-auto pt-3 border-t border-gray-200 px-3 mb-3">
        <Link
          to={settingMenu.path}
          onClick={() => setActiveMenu(settingMenu.name)}
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
            activeMenu === settingMenu.name
              ? "text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          style={{
            backgroundColor:
              activeMenu === settingMenu.name ? "#00A9FF" : "transparent",
          }}
        >
          <img
            src={settingMenu.icon}
            alt={settingMenu.name}
            className={`min-w-[22px] min-h-[22px] w-6 h-6 transition-all duration-200 ${
              activeMenu === settingMenu.name ? "brightness-0 invert" : ""
            }`}
          />
          <span
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isOpen ? "ml-2 opacity-100" : "ml-0 opacity-0 w-0"
            }`}
          >
            {settingMenu.name}
          </span>
        </Link>
      </div>
    </div>
  );
}
