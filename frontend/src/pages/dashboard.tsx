import { useState } from "react";
import Layout from "../components/contanct/Layout";
import Header from "../components/contanct/header";
import SummaryCards from "../components/dashboard/SummaryCards";
import TrendChart from "../components/dashboard/TrendChart";
import RiskHeatmap from "../components/dashboard/RiskHeatMap";
import AssetTable from "../components/dashboard/AssetTable";
import Notifications from "../components/dashboard/Notifications";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <Header
        isSidebarOpen={true}
        toggleSidebar={() => {}}
        onSearchChange={setSearchQuery} // ⬅️ sambungkan ke Header
      />

      <div className="p-4 lg:p-6 bg-gray-50 min-h-screen mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Konten utama */}
          <div className="lg:col-span-3 space-y-6">
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-full">
                <TrendChart />
              </div>
              <div className="lg:col-span-1 h-full">
                <RiskHeatmap />
              </div>
            </div>
            <AssetTable searchQuery={searchQuery} /> {/* ⬅️ filter table */}
          </div>

          {/* Notifikasi di kanan */}
          <div className="lg:col-span-1">
            <Notifications />
          </div>
        </div>
      </div>
    </Layout>
  );
}
