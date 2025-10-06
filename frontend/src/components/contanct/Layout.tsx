import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (fixed di kiri) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Konten utama */}
      <div
        className={`transition-all duration-300 
          ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"} ml-0`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSearchChange={(value) => console.log(value)}
        />

        {/* Konten halaman */}
        <main className="px-6 py-6 mt-14 sm:mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
