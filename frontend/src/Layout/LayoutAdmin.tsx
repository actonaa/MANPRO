// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/NavbarAdmin";

export default function LayoutAdmin({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <main className="bg-gray-100 p-4 lg:ml-[240px] mt-[70px] lg:mt-[80px] min-h-[calc(100vh-80px)] lg:w-full xl:w-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
}
