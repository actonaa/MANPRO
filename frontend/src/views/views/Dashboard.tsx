import { useState } from "react";
import Layout from "../../components/contanct/Layout";
import Header from "../../components/contanct/header";
import SummaryCards from "../../components/dashboard/SummaryCards";
import DistribusiKategori from "../../components/dashboard/DistribusiKategori";
import RiskHeatmap from "../../components/dashboard/RiskHeatMap";
import AssetTable from "../../components/dashboard/AssetTable";
import RisikoResidual from "../../components/dashboard/RisikoResidual";
import PemeliharaanMendatang from "../../components/dashboard/PemeliharaanMendatang";


export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      {/* 🔍 Header tetap responsif */}
      <Header
        isSidebarOpen={true}
        toggleSidebar={() => {}}
        onSearchChange={setSearchQuery}
      />

      {/* ✅ Wrapper utama */}
      <div className="p-4 lg:p-6 bg-gray-50 min-h-screen mt-6">
        <div className="space-y-6 max-w-full mx-auto ">
          {/* 📊 Ringkasan Aset */}
          <SummaryCards />

          {/* 📈 Distribusi & Risiko */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Distribusi Kategori */}
            <div className="lg:col-span-2 w-full">
              <DistribusiKategori />
            </div>

            {/* Top 10 Risiko */}
            <div className="lg:col-span-1 w-full">
              <RiskHeatmap />
            </div>
          </div>

          {/* 📋 Aktivitas Aset */}
          <div className="w-full">
            <AssetTable searchQuery={searchQuery} />
          </div>

          {/* 📊 Risiko Residual & Pemeliharaan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RisikoResidual />
            <PemeliharaanMendatang />
          </div>
        </div>
      </div>
    </Layout>
  );
}
