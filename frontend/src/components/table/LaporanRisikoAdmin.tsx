/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import ExportModal from "../../components/dropdown/Export";
import { Upload } from "lucide-react";

type RisikoItem = {
  id: string;
  namaAset: string;
  namaRisiko: string;
  level: string;
  skor: number;
  kategori: string;
  status: string;
  date: string;
  dinas: string | null;
};

const getLevelColor = (level: string) => {
  if (level === "High") return "text-red-500 font-semibold";
  if (level === "Medium") return "text-orange-500 font-semibold";
  if (level === "Low") return "text-green-500 font-semibold";
  return "text-gray-600";
};

const getStatusStyle = (status: string) => {
  if (status === "approved")
    return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium";
  if (status === "planned")
    return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium";
  if (status === "rejected")
    return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium";
  return "text-gray-600";
};

export default function RisikoTableSection({ search, dinas, period, level, status }: any) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [data, setData] = useState<RisikoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://asset-risk-management.vercel.app/api/risks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!Array.isArray(json)) return setData([]);

        const mapped: RisikoItem[] = json.map((item: any) => ({
          id: item.id,
          namaAset: item.asset_info?.name || "Tidak ada aset",
          namaRisiko: item.title,
          level: item.criteria,
          skor: item.entry_level,
          kategori: item.risk_category?.name || "-",
          status: item.status,
          date: item.created_at,
          dinas: item.department?.name || null,
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, []);

  const filteredData = useMemo(() => {
    setCurrentPage(1); // reset saat filter berubah

    return data.filter((item) => {
      const itemDate = new Date(item.date);

      const matchSearch = search
        ? item.namaAset.toLowerCase().includes(search.toLowerCase()) ||
          item.namaRisiko.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchDinas = dinas ? item.dinas?.toLowerCase() === dinas.toLowerCase() : true;

      const matchPeriod = period
        ? itemDate >= new Date(period.start) && itemDate <= new Date(period.end)
        : true;

      const matchLevel = level ? item.level.toLowerCase() === level.toLowerCase() : true;

      const matchStatus = status ? item.status.toLowerCase() === status.toLowerCase() : true;

      return matchSearch && matchDinas && matchPeriod && matchLevel && matchStatus;
    });
  }, [search, dinas, period, level, status, data]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // 🔹 Fungsi styling nomer halaman seperti Capt contoh mu
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 1) pages.push(currentPage - 1);
      pages.push(currentPage);
      if (currentPage < totalPages) pages.push(currentPage + 1);
    }

    return pages;
  };

  if (loading)
    return <p className="text-center py-6 text-gray-600 font-medium">Memuat data risiko...</p>;

  return (
    <div className="rounded-2xl p-2 border border-gray-100">
      <div className="hidden md:block rounded-xl bg-white">

        {/* Export Button */}
        <div className="flex mb-3 p-4">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-[1000px] w-full text-sm text-center text-gray-600">
            <thead>
              <tr>
                <th className="py-5 px-4 font-semibold">ID RISIKO</th>
                <th className="py-5 px-4 font-semibold">NAMA ASET</th>
                <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
                <th className="py-5 px-4 font-semibold">LEVEL</th>
                <th className="py-5 px-4 font-semibold">SKOR</th>
                <th className="py-5 px-4 font-semibold">KATEGORI</th>
                <th className="py-5 px-4 font-semibold">STATUS</th>
                <th className="py-5 px-4 font-semibold">DINAS</th>
                <th className="py-5 px-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {displayedData.length ? (
                displayedData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-5 px-4 font-semibold">{item.id}</td>
                    <td className="py-5 px-4">{item.namaAset}</td>
                    <td className="py-5 px-4">{item.namaRisiko}</td>
                    <td className={`py-5 px-4 ${getLevelColor(item.level)}`}>{item.level}</td>
                    <td className="py-5 px-4">{item.skor}</td>
                    <td className="py-5 px-4">{item.kategori}</td>
                    <td className="py-5 px-4">
                      <span className={getStatusStyle(item.status)}>{item.status}</span>
                    </td>
                    <td className="py-5 px-4">{item.dinas || "-"}</td>

                    <td className="py-5 px-4">
                      <a href={`/laporan/risiko-admin/${item.id}`} className="text-blue-500 hover:underline font-medium">
                        Detail
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} className="py-4 text-gray-400 italic">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Fix */}
        {totalItems > itemsPerPage && (
          <div className="mt-5 p-2 relative">

            {/* Info Data */}
            <p className="absolute left-2 text-sm text-gray-600 font-medium">
              Menampilkan {startIdx} – {endIdx} dari {totalItems} Data
            </p>

            {/* Navigasi */}
            <div className="flex justify-center">
              <div className="flex items-center gap-3">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-2 disabled:text-gray-400 text-lg hover:text-blue-600"
                >
                  ‹
                </button>

                {getPageNumbers().map((num, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                      currentPage === num ? "bg-gray-200 font-semibold" : "hover:text-blue-600"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2 disabled:text-gray-400 text-lg hover:text-blue-600"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </div>
  );
}
