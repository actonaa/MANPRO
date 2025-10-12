import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      icon: "/sidebar-icon/dashboard.png",
      path: "/dashboard",
    },
    { name: "Kelola Aset", icon: "/sidebar-icon/Aset.png", path: "/aset" },
    {
      name: "Pemeliharaan",
      icon: "/sidebar-icon/Maintenance.png",
      path: "/pemeliharaan",
    },
    { name: "Laporan", icon: "/sidebar-icon/Laporan.png", path: "/laporan" },
    {
      name: "Notifikasi",
      icon: "/sidebar-icon/Notif.png",
      path: "/notifikasi",
    },
    {
      name: "Manajemen Risiko",
      icon: "/sidebar-icon/Risk.png",
      path: "/manajemen-risiko",
    },
  ];

  const settingMenu = {
    name: "Pengaturan",
    icon: "/sidebar-icon/Setting.png",
    path: "/pengaturan",
  };

  return (
    <>
      {/* Overlay ketika sidebar terbuka di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 flex flex-col
          ${isOpen ? "w-64" : "w-20"} 
          ${
            // 🧠 Hanya tambahkan animasi di mobile
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${window.innerWidth < 1024 ? "transition-all duration-300" : ""}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6 mt-3">
          <img
            src={isOpen ? "/logo/logosirasa.png" : "/logo/logo.png"}
            alt="Logo"
            className={` ${isOpen ? "w-28" : "w-10"}`}
          />
        </div>

        {/* Menu Utama */}
        <ul className="flex flex-col gap-2">
          {menus.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`relative flex items-center h-12 rounded-xl cursor-pointer px-3 gap-3
                    ${
                      isActive
                        ? "text-white bg-[#00A9FF]"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    ${!isOpen && "justify-center"}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-md"></span>
                  )}
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
                    <span className="whitespace-nowrap">{item.name}</span>
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
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className={`relative flex items-center h-12 rounded-xl cursor-pointer transition-all duration-200 px-3 gap-3
              ${
                location.pathname === settingMenu.path
                  ? "text-white bg-[#00A9FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }
              ${!isOpen && "justify-center"}`}
          >
            {location.pathname === settingMenu.path && (
              <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-md"></span>
            )}
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src={settingMenu.icon}
                alt={settingMenu.name}
                className={`w-5 h-5 ${
                  location.pathname === settingMenu.path
                    ? "brightness-0 invert"
                    : ""
                }`}
              />
            </div>
            {isOpen && (
              <span className="whitespace-nowrap">{settingMenu.name}</span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
