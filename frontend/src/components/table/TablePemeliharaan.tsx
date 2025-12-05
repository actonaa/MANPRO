/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

type TablePemeliharaanProps = {
  kategori?: string;
  tanggal?: string;
  searchQuery?: string;
};

export default function TablePemeliharaan({
  kategori = "",
  tanggal = "",
}: TablePemeliharaanProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mapping data ke struktur tabel
  const mappedData = data.map((item) => ({
    idAset: item.asset_id,
    idLaporan: item.id,
    jenis: item.type || "Pemeliharaan",
    biaya: item.cost ? `Rp${Number(item.cost).toLocaleString("id-ID")}` : "-",
    vendor: item.vendor || "Tidak Ada Vendor",
    realisasi: item.completion_date || item.scheduled_date || "-",
    rawTanggal: item.completion_date || item.scheduled_date || "",
  }));

  // Filter kategori + tanggal
  const filteredData = mappedData.filter((row) => {
    const matchKategori = kategori
      ? row.jenis?.toLowerCase() === kategori.toLowerCase()
      : true;

    const matchTanggal = tanggal ? row.rawTanggal.includes(tanggal) : true;

    return matchKategori && matchTanggal;
  });

  // 🔥 Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const pageData = filteredData.slice(startIndex, endIndex);

  if (loading)
    return (
      <div className="bg-white md:rounded-b-xl p-6">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-7">ID ASET</th>
              <th className="px-6 py-7">ID LAPORAN</th>
              <th className="px-6 py-7">JENIS</th>
              <th className="px-6 py-7">BIAYA</th>
              <th className="px-6 py-7">VENDOR</th>
              <th className="px-6 py-7">REALISASI</th>
              <th className="px-6 py-7"></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-6 py-6">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <>
      <div className="hidden lg:block bg-white md:rounded-b-xl">
        <table className="w-full text-sm text-left border-spacing-y-3">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-7">ID ASET</th>
              <th className="px-6 py-7">ID LAPORAN</th>
              <th className="px-6 py-7">JENIS</th>
              <th className="px-6 py-7">BIAYA</th>
              <th className="px-6 py-7">VENDOR</th>
              <th className="px-6 py-7">REALISASI</th>
              <th className="px-6 py-7"></th>
            </tr>
          </thead>

          <tbody>
            {pageData.length > 0 ? (
              pageData.map((row, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-7">{row.idAset}</td>
                  <td className="px-6 py-7">{row.idLaporan}</td>
                  <td className="px-6 py-7 capitalize">{row.jenis}</td>
                  <td className="px-6 py-7">{row.biaya}</td>
                  <td className="px-6 py-7">{row.vendor}</td>
                  <td className="px-6 py-7">{row.realisasi}</td>
                  <td className="px-6 py-7 text-right">
                    <a
                      href={`/laporan/pemeliharaan/${row.idLaporan}`}
                      className="text-[#0095E8] font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-400 italic"
                >
                  Tidak ada data yang cocok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between bg-white">
        <p className="text-gray-600 text-sm px-3 py-6 mt-4">
          Menampilkan <b>{startIndex + 1}</b>–<b>{endIndex}</b> dari{" "}
          <b>{totalItems}</b> pemeliharaan
        </p>
        {/* 🔥 Pagination UI */}
        <div className="flex justify-center py-6 space-x-2">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
            }`}
          >
            ‹
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-100"
            }`}
          >
            ›
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
}
