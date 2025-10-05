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

export default function Sidebar({ isOpen }: SidebarProps) {
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
      {/* ✅ Sidebar hanya muncul di Desktop */}
      <div
        className={`hidden lg:flex fixed top-0 left-0 bg-white h-screen p-4 shadow-md transition-all duration-300 flex-col z-50
        ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6 mt-1">
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
                  onClick={() => setActiveMenu(item.name)}
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
              <span className="transition-all duration-300 whitespace-nowrap">
                {settingMenu.name}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ✅ Bottom Navbar hanya untuk Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-between z-50">
        {[...menus, settingMenu].map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setActiveMenu(item.name)}
              className={`flex flex-col items-center justify-center flex-1 text-xs transition-colors duration-200
          ${
            isActive
              ? "bg-[#00A9FF] text-white"
              : "text-gray-500 hover:text-[#00A9FF]"
          }`}
            >
              <img
                src={item.icon}
                alt={item.name}
                className={`w-6 h-6 mb-1 ${
                  isActive ? "brightness-0 invert" : ""
                }`}
              />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
