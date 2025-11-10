/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
}

export default function TableAset({
  selectedKategori,
  selectedStatus,
}: {
  selectedKategori?: string;
  selectedStatus?: string;
}) {
  const [data, setData] = useState<Asset[]>([]);
  const [filteredData, setFilteredData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5; // 🔹 tampil 5 data per halaman

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/assets", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data (${res.status})`);
        }

        const json = await res.json();
        setData(json);
        setFilteredData(json); // awalnya tampil semua
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // 🔹 Filter otomatis setiap kali kategori/status berubah
  useEffect(() => {
    let filtered = data;

    if (selectedKategori) {
      filtered = filtered.filter(
        (item) => item.category?.name === selectedKategori
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (item) => item.status?.name === selectedStatus
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // reset ke halaman pertama setiap kali filter berubah
  }, [selectedKategori, selectedStatus, data]);

  // 🔹 Hitung data yang ditampilkan per halaman
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-[#BBF7D0] text-[#166534] md:px-10 px-7";
      case "Perbaikan":
        return "bg-yellow-200 text-yellow-800";
      case "Non-Aktif":
      case "Tidak Aktif":
        return "bg-red-200 text-red-800 md:px-5 md:text-nowrap";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) return <p className="py-5 text-center">Memuat data...</p>;
  if (error) return <p className="text-center py-5 text-red-500">{error}</p>;

  return (
    <div className="lg:rounded-b-xl lg:bg-white">
      <div className="hidden lg:block overflow-x-auto mt-5 md:mt-0">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-[#ddd] hover:bg-gray-50"
                >
                  <td className="py-5 px-4 text-[#333]">
                    {item.serial_number || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]">{item.name}</td>
                  <td className="py-5 px-4 text-[#666]">
                    {item.category?.name || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]">
                    {item.lokasi || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]">
                    <span
                      className={`px-5 py-2 rounded-[16px] text-[13px] font-normal ${getStatusColor(
                        item.status?.name || ""
                      )}`}
                    >
                      {item.status?.name || "-"}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#666]">
                    {item.acquisition_date || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-5 text-center text-gray-500 italic"
                >
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 🔹 Pagination Control (tampilkan hanya 5 nomor dinamis) */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-2 py-5">
            {/* Tombol kiri */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 text-lg ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ‹
            </button>

            {/* Nomor halaman dinamis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
                Math.max(5, Math.min(currentPage + 2, totalPages))
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                    currentPage === page
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {page}
                </button>
              ))}

            {/* Tombol kanan */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-2 text-lg ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
