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
        { name: "Data Aset", path: "/aset/tambah" },
        { name: "Laporan Aset", path: "/aset/laporan" },
      ],
    },
    {
      name: "Kelola Risiko",
      icon: "/sidebar-icon/Risk.png",
      path: "/manajemen-risiko",
      submenu: [
        { name: "Data Risiko", path: "/manajemen-risiko/data" },
        { name: "Laporan Risiko", path: "/manajemen-risiko/laporan" },
      ],
    },
    {
      name: "Pemeliharaan",
      icon: "/sidebar-icon/Maintenance.png",
      path: "/pemeliharaan",
    },
    {
      name: "Notifikasi",
      icon: "/sidebar-icon/Notif.png",
      path: "/notifikasi",
    },
  ];

  const settingMenu = {
    name: "Keluar",
    icon: "/sidebar-icon/Logout.png",
    path: "/logout",
  };

  // ✅ Buka dropdown otomatis saat berada di submenu
  useEffect(() => {
    const activeDropdown = menus.find((menu) =>
      menu.submenu?.some((sub) => sub.path === location.pathname)
    );
    if (activeDropdown) {
      if (!openDropdowns.includes(activeDropdown.name)) {
        setOpenDropdowns((prev) => [...prev, activeDropdown.name]);
      }
      setActiveMenu(activeDropdown.name);
    } else {
      const currentMenu = menus.find((menu) => menu.path === location.pathname);
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 flex flex-col
          ${isOpen ? "w-64" : "w-20"} 
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0 transition-all duration-300"
          }`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10 mt-3">
          <img
            src={isOpen ? "/logo/logosirasa.png" : "/logo/logo.png"}
            alt="Logo"
            className={`${isOpen ? "w-28" : "w-10"}`}
          />
        </div>

        {/* Menu Utama */}
        <ul className="flex flex-col gap-2">
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
                      // ✅ Klik langsung ke route dashboard / menu utama
                      setActiveMenu(item.name);
                      navigate(item.path);
                      setOpenDropdowns([]); // tutup semua dropdown
                      if (window.innerWidth < 1024) toggleSidebar();
                    }
                  }}
                  className={`relative flex items-center h-12 rounded-xl cursor-pointer px-3 gap-3 transition-all duration-200
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
                  {isOpen && (
                    <>
                      <span className="whitespace-nowrap flex-1">
                        {item.name}
                      </span>
                      {hasSubmenu && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu && isOpen && isDropdownOpen && (
                  <ul className="ml-3 mt-1 flex flex-col gap-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
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

        {/* Menu Keluar */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <Link
            to={settingMenu.path}
            onClick={() => {
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className={`relative flex items-center h-12 rounded-xl cursor-pointer transition-all duration-200 px-3 gap-3
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
          </Link>
        </div>
      </div>
    </>
  );
}
