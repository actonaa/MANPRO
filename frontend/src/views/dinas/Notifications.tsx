/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import FilterTabs from "../../components/Notifikasi/dinas/FilterTabs";
import NotifikasiList from "../../components/Notifikasi/dinas/NotifikasiList";
import SearchBar from "../../components/Notifikasi/dinas/SearchBar";
import axios from "axios";

interface NotificationResponse {
  id: string;
  category: string;
  message: string;
  timestamp: string;
  link_target: string;
  title: string;
  is_read: boolean;
  type: string;
}

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get<NotificationResponse[]>(
          "https://asset-risk-management.vercel.app/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const mapped = res.data.map((item) => ({
          id: item.id,
          kategori: item.category || "Umum",
          pesan: item.message,
          waktu: formatTime(item.timestamp),
          link: item.link_target,
          title: item.title,
          is_read: item.is_read,
          type: item.type,
        }));

        setAllData(mapped);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [token]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const counts = {
    semua: allData.length,
    aset: allData.filter((d) => d.kategori.toLowerCase() === "asset").length,
    risiko: allData.filter((d) => d.kategori.toLowerCase() === "risiko").length,
    belum: allData.filter((d) => !d.is_read).length,
  };

  let filteredData = allData.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "aset") return item.kategori.toLowerCase() === "asset";
    if (activeTab === "risiko") return item.kategori.toLowerCase() === "risiko";
    if (activeTab === "belum") return item.is_read === false;
    return true;
  });

  if (searchQuery.trim() !== "") {
    filteredData = filteredData.filter(
      (item) =>
        item.pesan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (loading)
    return (
      <div className="animate-pulse">
        {/* Header */}
        <div className="mb-4">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-60 bg-gray-200 rounded mt-2"></div>
        </div>

        <div className="bg-white rounded-xl p-5 space-y-6">
          {/* Top bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-full md:w-1/3 bg-gray-200 rounded"></div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 bg-gray-200 rounded-full"></div>
            ))}
          </div>

          {/* List skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 rounded-xl flex gap-3"
              >
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <>
      <h1 className="text-2xl md:text-2xl font-semibold">Notifikasi</h1>
      <p className="text-sm text-gray-600 mt-1 mb-5">
        Ketahui pesan terbaru untuk akun anda.
      </p>

      <div className="bg-white rounded-xl p-5 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-lg font-semibold text-gray-800">
            {allData.length} Notifikasi
          </h1>

          <div className="w-full md:w-1/3">
            <SearchBar onSearch={(val) => setSearchQuery(val)} />
          </div>
        </div>

        <FilterTabs counts={counts} onTabChange={(tab) => setActiveTab(tab)} />

        <NotifikasiList data={filteredData} />
      </div>
    </>
  );
}
