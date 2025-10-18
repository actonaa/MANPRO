import { Link, useLocation } from "react-router-dom";
import IconDashboard from "../../img/sidebar-icon/dashboard.png";
import IconAset from "../../img/sidebar-icon/Aset.png";
import IconMaintenance from "../../img/sidebar-icon/Maintenance.png";
import IconNotif from "../../img/sidebar-icon/Notif.png";
import IconRisk from "../../img/sidebar-icon/Risk.png";
import IconSetting from "../../img/sidebar-icon/Setting.png";

export default function SidebarMobile() {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", icon: IconDashboard, path: "/dashboard" },
    { name: "Aset", icon: IconAset, path: "/kelola-aset" },
    { name: "Risiko", icon: IconRisk, path: "/kelola-risiko" },
    { name: "Pemeliharaan", icon: IconMaintenance, path: "/pemeliharaan" },
    { name: "Notif", icon: IconNotif, path: "/notifikasi" },
    { name: "Setting", icon: IconSetting, path: "/pengaturan" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.1)] z-50 flex justify-between items-stretch">
      {menus.map((item) => {
        // 🔹 Menu aktif jika path saat ini cocok dengan menu.path
        const isActive = location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
              isActive
                ? "bg-[#00A9FF] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={`w-6 h-6 mb-1 transition-all duration-200 ${
                isActive ? "brightness-0 invert" : ""
              }`}
            />
            <span className="text-[11px] font-medium whitespace-nowrap">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
