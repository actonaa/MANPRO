import { useState } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterTabs from "../../components/Notifikasi/dinas/FilterTabs";
import NotifikasiList from "../../components/Notifikasi/dinas/NotifikasiList";
import SearchBar from "../../components/Notifikasi/dinas/SearchBar";

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ✅ Data dummy sementara
  const allData = [
    {
      id: 1,
      kategori: "Aset",
      pesan: "Aset baru terdaftar",
      waktu: "Just Now",
    },
    {
      id: 2,
      kategori: "Risiko",
      pesan: "Risiko tinggi terdeteksi",
      waktu: "30 menit lalu",
    },
    {
      id: 3,
      kategori: "Aset",
      pesan: "Perubahan status aset",
      waktu: "2 jam lalu",
    },
    {
      id: 4,
      kategori: "Risiko",
      pesan: "Mitigasi risiko selesai",
      waktu: "1 hari lalu",
    },
  ];

  // ✅ 1. Filter berdasarkan tab aktif
  let filteredData = allData.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "aset") return item.kategori === "Aset";
    if (activeTab === "risiko") return item.kategori === "Risiko";
    if (activeTab === "belum") return item.waktu === "Just Now";
    return true;
  });

  // ✅ 2. Filter berdasarkan pencarian teks
  if (searchQuery.trim() !== "") {
    filteredData = filteredData.filter(
      (item) =>
        item.pesan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <LayoutDinas>
      <div className="p-6 bg-white rounded-xl shadow-sm space-y-6">
        {/* 🔔 Judul Halaman */}
        <h1 className="text-2xl font-semibold text-gray-800">
          🔔 Notifikasi
        </h1>

        {/* 🔍 Filter dan Pencarian */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <FilterTabs onTabChange={(tab) => setActiveTab(tab)} />
          <SearchBar onSearch={(val) => setSearchQuery(val)} />
        </div>

        {/* 📬 Daftar Notifikasi */}
        <NotifikasiList data={filteredData} />
      </div>
    </LayoutDinas>
  );
}
