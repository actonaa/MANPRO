/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TableAudit({ filters }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://asset-risk-management.vercel.app/api/audit-logs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formatted = res.data.map((item: any) => ({
          date: item.tanggal,
          dinas: item.pengguna?.nama || "-", // Ambil nama asli dari API
          modul: item.modul,
          aksi: item.aksi,
          detail: item.detail,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ================= SKELETON DESKTOP =================
  if (loading) {
    return (
      <div className="space-y-4 p-5">
        <h2 className="text-gray-700 font-semibold mb-3">Aktivitas Sistem Terkini</h2>

        {/* Skeleton Desktop */}
        <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-[#EDEDED] p-5 animate-pulse">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead className="text-[#666] border-b border-[#EDEDED]">
              <tr>
                {["Tanggal & Waktu", "NAMA PENGGUNA", "MODUL", "AKSI", "DETAIL"].map(
                  (idx) => (
                    <th key={idx} className="py-4 px-2 font-semibold">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: itemsPerPage }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-[#EDEDED]">
                  {Array.from({ length: 5 }).map((_, colIdx) => (
                    <td key={colIdx} className="py-5 px-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton Mobile */}
        <div className="xl:hidden grid grid-cols-1 gap-4">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-300 bg-white rounded-xl p-4 shadow animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // FILTER DATA
  const filtered = data.filter((item) => {
    const s = filters?.search?.toLowerCase() || "";

    const matchSearch =
      !s ||
      item.dinas.toLowerCase().includes(s) ||
      item.modul.toLowerCase().includes(s) ||
      item.aksi.toLowerCase().includes(s) ||
      item.detail.toLowerCase().includes(s);

    const matchDate =
      filters?.date?.start && filters?.date?.end
        ? new Date(item.date) >= new Date(filters.date.start) &&
          new Date(item.date) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex - 1, endIndex);

  return (
    <div className="space-y-4">
      <h2 className="text-gray-700 font-semibold">Aktivitas Sistem Terkini</h2>

      {/* TABLE DESKTOP */}
      <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-[#EDEDED] p-5">
        <table className="w-full min-w-[1000px] text-[14px] text-left border-collapse">
          <thead className="text-[#666] border-b border-[#EDEDED]">
            <tr>
              <th className="py-4 px-2 font-semibold">Tanggal & Waktu</th>
              <th className="py-4 px-2 font-semibold">NAMA PENGGUNA</th>
              <th className="py-4 px-2 font-semibold">MODUL</th>
              <th className="py-4 px-2 font-semibold">AKSI</th>
              <th className="py-4 px-2 font-semibold w-[320px]">DETAIL</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-[#EDEDED] last:border-0 hover:bg-gray-50 transition"
              >
                <td className="py-5 px-2 font-medium text-gray-800 whitespace-nowrap">
                  {new Date(item.date).toLocaleString("id-ID")}
                </td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">{item.dinas}</td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">{item.modul}</td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">{item.aksi}</td>
                <td className="py-5 px-2 text-gray-700 leading-relaxed">{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center pt-5">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex}–{endIndex} dari {filtered.length} data
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1
              )
              .map((n, i, arr) => {
                const prev = arr[i - 1];
                return (
                  <div key={n} className="flex items-center">
                    {prev && n - prev > 1 && <span className="px-2">...</span>}
                    <button
                      onClick={() => setCurrentPage(n)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === n ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  </div>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="w-24" />
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="xl:hidden grid grid-cols-1 gap-4">
        {currentData.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-300 bg-white rounded-xl p-4 shadow-sm"
          >
            <p className="text-gray-600 text-sm mb-1">
              {new Date(item.date).toLocaleString("id-ID")}
            </p>

            <div className="text-sm text-gray-800 space-y-1">
              <p>
                <strong>Pengguna:</strong> {item.dinas}
              </p>
              <p>
                <strong>Modul:</strong> {item.modul}
              </p>
              <p>
                <strong>Aksi:</strong> {item.aksi}
              </p>
              <p className="pt-1">
                <strong>Detail:</strong> <br /> {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
