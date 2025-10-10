import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import SidebarMobile from "./SidebarMobile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <div
        className={`hidden sm:flex bg-white shadow-md h-screen transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSearchChange={(value) => console.log(value)}
        />

        <main className="flex-1 overflow-y-auto p-4 mt-14 sm:mt-16">
          {children}
        </main>
      </div>

      {/* Sidebar Mobile di bawah */}
      <div className="sm:hidden">
        <SidebarMobile />
      </div>
    </div>
  );
}
