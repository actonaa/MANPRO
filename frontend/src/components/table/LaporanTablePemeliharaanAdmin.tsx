/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TablePemeliharaanProps = {
  kategori?: string;
  status?: string;
  tanggal?: string;
  dinas?: string;
  search?: string;
};

export default function TablePemeliharaanAdmin({
  kategori = "",
  status = "",
  tanggal = "",
  dinas = "",
  search = "",
}: TablePemeliharaanProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const formatTanggal = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID");
  };

  // ================================
  // FETCH DATA API
  // ================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const json = await res.json();

        const mapped = json?.map((item: any) => ({
          idAset: item.asset_id || "-",
          idLaporan: item.id || "-",
          jenis: item.type || "-",
          biaya: item.cost
            ? `Rp${item.cost.toLocaleString("id-ID")}`
            : "-",
          vendor: item.vendor || "-",
          realisasi: formatTanggal(item.completion_date),
          status: item.status || "-",
          dinas: item.asset?.department?.name || "-",
        }));

        setData(mapped || []);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================================
  // FILTER DATA
  // ================================
  const filteredData = data.filter((row) => {
    const matchKategori = kategori ? row.jenis.toLowerCase() === kategori.toLowerCase() : true;
    const matchStatus = status ? row.status.toLowerCase() === status.toLowerCase() : true;
    const matchTanggal = tanggal ? row.realisasi.includes(tanggal) : true;

    const matchDinas = dinas
      ? row.dinas.toLowerCase().trim() === dinas.toLowerCase().trim()
      : true;

    const matchSearch = search
      ? Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
      : true;

    return (
      matchKategori &&
      matchStatus &&
      matchTanggal &&
      matchDinas &&
      matchSearch
    );
  });

  // ================================
  // PAGINATION LOGIC
  // ================================
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);

  const paginatedRows = filteredData.slice(startIndex, endIndex);

  if (loading) {
    return <p className="text-center py-4">Memuat data...</p>;
  }

  return (
    <>
      {/* ================= DESKTOP TABLE ================ */}
      <div className="hidden lg:block bg-white overflow-x-auto rounded-b-xl">
        <table className="w-full text-sm text-left border-spacing-y-3">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">ID ASET</th>
              <th className="px-6 py-3">ID LAPORAN</th>
              <th className="px-6 py-3">JENIS</th>
              <th className="px-6 py-3">BIAYA</th>
              <th className="px-6 py-3">VENDOR</th>
              <th className="px-6 py-3">REALISASI</th>
              <th className="px-6 py-3">DINAS</th>
              <th className="px-6 py-3 text-right">DETAIL</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5">{row.idAset}</td>
                  <td className="px-6 py-5">{row.idLaporan}</td>
                  <td className="px-6 py-5">{row.jenis}</td>
                  <td className="px-6 py-5">{row.biaya}</td>
                  <td className="px-6 py-5">{row.vendor}</td>
                  <td className="px-6 py-5">{row.realisasi}</td>
                  <td className="px-6 py-5">{row.dinas}</td>

                  <td className="px-6 py-5 text-right">
                    <a
                      href={`/laporan/pemeliharaan-admin/${row.idLaporan}`}
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
                  colSpan={8}
                  className="text-center py-6 text-gray-400 italic"
                >
                  Tidak ada data yang cocok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD ================ */}
      <div className="block lg:hidden">
        {paginatedRows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedRows.map((row, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {row.idAset}
                  </p>
                  <a
                    href={`/detail/laporan/${row.idLaporan}`}
                    className="text-[#0095E8] text-sm font-medium hover:underline"
                  >
                    Detail
                  </a>
                </div>

                <h3 className="font-semibold text-gray-800 text-[15px] mb-3 border-b pb-2">
                  {row.vendor}
                </h3>

                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Kategori:</span>
                    <span>{row.jenis}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Dinas:</span>
                    <span>{row.dinas}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Biaya:</span>
                    <span>{row.biaya}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Realisasi:</span>
                    <span>{row.realisasi}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">Tidak ada data yang cocok.</p>
        )}
      </div>

      {/* ================= PAGINATION ================ */}
      <div className="pt-5">
        <p className="text-sm text-gray-600 mb-3">
          Menampilkan {filteredData.length === 0 ? 0 : startIndex + 1}–
          {endIndex} dari {filteredData.length} data
        </p>

        <div className="flex justify-center items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page 1 */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === 1
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            1
          </button>

          {/* Left … */}
          {currentPage > 3 && <span className="px-2">...</span>}

          {/* Current - 1 */}
          {currentPage > 2 && currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
            >
              {currentPage - 1}
            </button>
          )}

          {/* Current */}
          {currentPage !== 1 && currentPage !== totalPages && (
            <button className="px-3 py-1 rounded-lg text-sm bg-blue-600 text-white">
              {currentPage}
            </button>
          )}

          {/* Current + 1 */}
          {currentPage < totalPages - 1 && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
            >
              {currentPage + 1}
            </button>
          )}

          {/* Right … */}
          {currentPage < totalPages - 2 && <span className="px-2">...</span>}

          {/* Last Page */}
          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === totalPages
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {totalPages}
            </button>
          )}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
