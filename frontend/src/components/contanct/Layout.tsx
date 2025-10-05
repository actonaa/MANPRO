import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (hanya muncul di Desktop, diatur di Sidebar.tsx) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSearchChange={(value) => console.log(value)}
        />

        {/* ✅ Tambahkan pb-16 supaya konten tidak ketiban bottom navbar di mobile */}
        <main className="flex-1 overflow-y-auto p-4 mt-12 sm:mt-14 pb-16 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
