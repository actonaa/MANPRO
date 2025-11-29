/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface TableAktivitasProps {
  searchQuery?: string;
}

export default function TableAktivitas({
  searchQuery = "",
}: TableAktivitasProps) {
  const [aktivitas, setAktivitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Ambil data API
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/audit-logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Sort tanggal terbaru + ambil 3 saja
      const sorted = data
        .sort(
          (a: any, b: any) =>
            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        )
        .slice(0, 3);

      setAktivitas(sorted);
    } catch (error) {
      console.error("Gagal fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Filter pencarian
  const filteredAktivitas = aktivitas.filter((item) => {
    const waktu = new Date(item.tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      waktu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aksi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Format tanggal
  const formatTanggal = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="bg-white p-5 w-full rounded-xl shadow-lg">
      <h2 className="text-[22px] font-semibold text-black mb-4">
        Aktivitas Terbaru
      </h2>

      {/* 📱 MOBILE */}
      <div className="block lg:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-4">Memuat...</p>
        ) : filteredAktivitas.length === 0 ? (
          <p className="text-center text-gray-500 py-4 italic">
            Tidak ada aktivitas yang cocok
          </p>
        ) : (
          filteredAktivitas.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start bg-white p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {item.detail}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTanggal(item.tanggal)} - {item.modul}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {item.aksi}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 💻 DESKTOP */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse rounded-lg">
          <thead>
            <tr className="text-left text-xs text-[#6B7280]">
              <th className="px-4 py-[20px] font-semibold text-center">
                WAKTU
              </th>
              <th className="px-4 py-[20px] font-semibold">JENIS AKTIVITAS</th>
              <th className="px-4 py-[20px] font-semibold">DESKRIPSI</th>
              <th className="px-4 py-[20px] font-semibold text-center">AKSI</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : (
              filteredAktivitas.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 text-xs font-semibold"
                >
                  <td className="px-4 py-[20px] text-center">
                    {formatTanggal(item.tanggal)}
                  </td>
                  <td className="px-4 py-[20px]">{item.modul}</td>
                  <td className="px-4 py-[20px]">{item.detail}</td>
                  <td className="px-4 py-[20px] text-center">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {item.aksi}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
