/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

type TableRisikoProps = {
  searchTerm?: string;
  selectedStatus?: string;
  selectedKategori?: string;
  selectedDinas?: string;
  selectedLevel?: string;
};

type RisikoItem = {
  id: string;
  title: string;
  type_of_risk: string;
  criteria: string;
  status: string;
  entry_level: number;
  asset_info: { name: string | null };
  risk_category: { name: string | null } | null;
  department: { name: string | null } | null;
};

const ITEMS_PER_PAGE = 10;

export default function TableRisikoAdmin({
  searchTerm = "",
  selectedStatus = "",
  selectedKategori = "",
  selectedDinas = "",
  selectedLevel = "",
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRisiko = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://asset-risk-management.vercel.app/api/risks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat data risiko");
        const json = await res.json();

        const mapped: RisikoItem[] = json.map((item: any) => ({
          id: item.id,
          title: item.title,
          type_of_risk: item.type_of_risk,
          criteria: item.criteria,
          status: item.status,
          entry_level: item.entry_level,
          asset_info: {
            name: item.asset_info?.name || "Tidak ada aset",
          },
          risk_category: {
            name: item.risk_category?.name || "-",
          },
          department: {
            name: item.department?.name || "-",
          },
        }));

        setData(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisiko();
  }, []);

  const getLevelColor = (level: string) => {
    if (level === "High") return "bg-red-100 text-red-600";
    if (level === "Medium") return "bg-yellow-100 text-yellow-600";
    if (level === "Low") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  const getStatusColor = (status: string) => {
    if (status === "approved") return "bg-green-100 text-green-600";
    if (status === "planned") return "bg-yellow-100 text-yellow-600";
    if (status === "rejected") return "bg-gray-300 text-gray-900";
    return "bg-gray-100 text-gray-600";
  };

  const filteredData = data.filter((item) => {
    const s = searchTerm.toLowerCase();
    return (
      (item.title.toLowerCase().includes(s) ||
        item.asset_info?.name?.toLowerCase().includes(s)) &&
      (!selectedStatus || item.status.toLowerCase() === selectedStatus.toLowerCase()) &&
      (!selectedKategori ||
        item.risk_category?.name?.toLowerCase() === selectedKategori.toLowerCase()) &&
      (!selectedDinas ||
        item.department?.name?.toLowerCase() === selectedDinas.toLowerCase()) &&
      (!selectedLevel ||
        item.criteria?.toLowerCase() === selectedLevel.toLowerCase())
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1);
      }
    }
    return pages;
  };

  if (loading) return <p className="text-center text-gray-500 py-6">Memuat data...</p>;

  return (
    <div className="mt-5">
      {/* Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full min-w-[1000px] text-[13px] text-center">
          <thead>
            <tr className="text-[#666] border-b border-[#ddd]">
              <th className="py-5">ID RISIKO</th>
              <th className="py-5">NAMA ASET</th>
              <th className="py-5">NAMA RISIKO</th>
              <th className="py-5">TIPE</th>
              <th className="py-5">LEVEL</th>
              <th className="py-5">STATUS</th>
              <th className="py-5">KATEGORI</th>
              <th className="py-5">SKOR</th>
              <th className="py-5">DINAS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-b-gray-300 hover:bg-gray-50">
                  <td className="py-5 text-[#333] font-semibold">{item.id}</td>

                  <td className="py-5 text-[#666]">{item.asset_info?.name}</td>

                  <td className="py-5 text-[#666]">{item.title}</td>

                  <td className="py-5 text-[#666]">{item.type_of_risk}</td>

                  <td className="py-5">
                    <span className={`px-4 py-1 rounded-full ${getLevelColor(item.criteria)}`}>
                      {item.criteria}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className={`px-4 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4 text-[#666]">
                    {item.risk_category?.name}
                  </td>

                  <td className="py-4 text-[#666]">{item.entry_level}</td>

                  <td className="py-4 text-[#666]">{item.department?.name}</td>

                  <td>
                    <a href={`/laporan/risiko-admin/${item.id}`} className="text-[#0095E8] hover:underline">
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-6 text-gray-500 italic">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > ITEMS_PER_PAGE && (
        <div className="mt-5 p-2 relative">
          <p className="absolute left-2 text-sm text-gray-600 font-medium">
            Menampilkan {startIndex + 1} – {endIndex} dari {totalItems} Data
          </p>

          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2 disabled:text-gray-400 text-lg hover:text-blue-600"
              >
                ‹
              </button>

              {getPageNumbers().map((num, idx) =>
                num === -1 ? (
                  <span key={idx} className="px-2">…</span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                      currentPage === num ? "bg-gray-200 font-semibold" : "hover:text-blue-600"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

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
  );
}
