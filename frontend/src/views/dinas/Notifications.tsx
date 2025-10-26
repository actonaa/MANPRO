import { useState } from "react";
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
    <>
      <h1 className="text-2xl md:text-2xl font-semibold">Notifikasi</h1>
      <p className="text-sm text-gray-600 mt-1 mb-5">
        Ketahui pesan terbaru untuk akun anda.
      </p>
      <div className="bg-white rounded-xl space-y-6">
        {/* 🔔 Judul + SearchBar di satu baris */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-lg font-semibold text-gray-800">
            188 Notifikasi
          </h1>

          {/* 🕵️ SearchBar di kanan */}
          <div className="w-full md:w-1/3">
            <SearchBar onSearch={(val) => setSearchQuery(val)} />
          </div>
        </div>

        {/* 🔍 Filter Tabs */}
        <FilterTabs onTabChange={(tab) => setActiveTab(tab)} />

        {/* 📬 Daftar Notifikasi */}
        <NotifikasiList data={filteredData} />
      </div>
    </>
  );
}
