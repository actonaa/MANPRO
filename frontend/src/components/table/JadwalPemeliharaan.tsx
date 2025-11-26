/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface Props {
  selectedKategori?: string;
  selectedPrioritas?: string;
  searchQuery?: string;
}

interface MaintenanceItem {
  id: string;
  asset_id: string;
  type: string | null;
  scheduled_date: string;
  completion_date: string | null;
  vendor: string | null;
  cost: number | null;
  notes: string | null;
  proof: string | null;
  status: string;
  priority: string | null;
  asset?: {
    name: string;
    lokasi: string;
    risk: { title: string }[];
  };
  risk?: string; // ← ganti kategori menjadi risk
  prioritas?: string | null;
}

export default function TableJadwalPemeliharaan({
  selectedKategori,
  selectedPrioritas,
  searchQuery,
}: Props) {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // ------------------------------
  // FETCH DATA
  // ------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const maintenanceData: MaintenanceItem[] = await res.json();

        // mapping risk
        const cleanedData = maintenanceData.map((item) => ({
          ...item,

          // pilih risk yang terkait treatment (lebih akurat)
          risk:
            item.asset?.risk?.find((r: any) => r?.risk_treatment?.length > 0)
              ?.title ?? "Tidak ada",

          prioritas: item.priority ?? null,
        }));

        setData(cleanedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------------------
  // FILTERING
  // ------------------------------
  const filteredData = data.filter(
    (item) =>
      (!selectedKategori || item.risk === selectedKategori) &&
      (!selectedPrioritas || item.prioritas === selectedPrioritas) &&
      (!searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ------------------------------
  // PAGINATION CALC
  // ------------------------------
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, filteredData.length, totalPages]);

  // ------------------------------
  // BADGE COLORS
  // ------------------------------
  const getBadgeColor = (prioritas?: string | null) => {
    if (!prioritas) return "bg-gray-100 text-gray-600";
    switch (prioritas.toLowerCase()) {
      case "tinggi":
        return "bg-red-100 text-red-600";
      case "sedang":
        return "bg-yellow-100 text-yellow-700";
      case "rendah":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ------------------------------
  // LOADING SKELETON
  // ------------------------------
  if (loading) {
    return (
      <div className="mt-5 bg-white md:mt-0 space-y-4">
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
            <thead>
              <tr>
                {Array.from({ length: 7 }).map((_, idx) => (
                  <th key={idx} className="py-5 px-4 font-semibold">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    );
  }

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="mt-5 bg-white md:mt-0">
      <div className="overflow-x-auto hidden lg:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead>
            <tr>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">RISIKO</th>
              <th className="py-5 px-4">LOKASI</th>
              <th className="py-5 px-4">PRIORITAS</th>
              <th className="py-5 px-4">JADWAL</th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-gray-200 hover:bg-gray-50"
                >
                  <td className="py-5 px-4">{item.id}</td>
                  <td className="py-5 px-4">{item.asset?.name ?? "-"}</td>
                  <td className="py-5 px-4">{item.risk}</td>
                  <td className="py-5 px-4">{item.asset?.lokasi ?? "-"}</td>
                  <td className="py-5 px-4">
                    <span
                      className={`px-5 py-2 rounded-[16px] ${getBadgeColor(
                        item.prioritas
                      )}`}
                    >
                      {item.prioritas ?? "Tidak ada"}
                    </span>
                  </td>
                  <td className="py-5 px-4">{item.scheduled_date}</td>
                  <td className="py-5 px-4">
                    <a
                      href={`/pemeliharaan/${item.id}`}
                      className="text-[#0095E8] hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-5 text-gray-500 italic">
                  Tidak ada jadwal pemeliharaan tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="mt-6 flex justify-between items-center p-4">
          <p className="text-[13px] text-[#6B7280]">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} dari{" "}
            {filteredData.length} hasil
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
