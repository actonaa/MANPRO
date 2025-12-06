/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import ExportModal from "../../components/dropdown/Export";

type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  status: string;
  date: string;
  dinas: string;
};

const getConditionColor = (condition: string) => {
  if (condition.toUpperCase() === "BAIK")
    return "text-green-600 font-semibold";
  if (condition.toUpperCase().includes("RINGAN"))
    return "text-yellow-600 font-semibold";
  if (condition.toUpperCase().includes("BERAT"))
    return "text-red-600 font-semibold";
  return "text-gray-600";
};

const getStatusStyle = (status: string) => {
  if (status === "Aktif")
    return "bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium";
  if (status === "Perbaikan")
    return "bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium";
  if (status === "Tidak Aktif")
    return "bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium";
  return "text-gray-600";
};

interface Props {
  dinas?: string;
  period?: string;
  condition?: string;
  status?: string;
  search?: string;
}

export default function AssetTableSection({
  dinas,
  period,
  condition,
  status,
  search,
}: Props) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================================
        FETCH DATA API
  ======================================== */
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();

        const mapped: Asset[] = json.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category?.name || "-",
          location: item.lokasi || "-",
          condition: item.condition?.name || "-",
          status: item.status?.name || "-",
          date: item.acquisition_date || "-",
          dinas: item.department?.name || "-",
        }));

        setData(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  /* =======================================
        FILTERING
  ======================================== */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const formattedDate = item.date?.split("-").join("-");

      const matchSearch = search
        ? item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchDinas = dinas
        ? item.dinas.toLowerCase() === dinas.toLowerCase()
        : true;

      const matchPeriod = period ? formattedDate === period : true;

      const matchCondition = condition
        ? item.condition.toLowerCase() === condition.toLowerCase()
        : true;

      const matchStatus = status
        ? item.status.toLowerCase() === status.toLowerCase()
        : true;

      return (
        matchSearch &&
        matchDinas &&
        matchPeriod &&
        matchCondition &&
        matchStatus
      );
    });
  }, [search, dinas, period, condition, status, data]);

  /* =======================================
        PAGINATION
  ======================================== */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalData = filteredData.length;
  const totalPages = Math.ceil(totalData / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalData);

  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  };

  /* =======================================
        RENDER
  ======================================== */
  return (
    <div className="mt-5">
      {loading && (
        <p className="text-center text-gray-500 italic">
          Memuat data aset...
        </p>
      )}

      {/* ======================= DESKTOP TABLE ======================= */}
      <div className="overflow-x-auto hidden lg:block bg-white rounded-2xl">
        <div className="flex justify-start mb-3 p-4">
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 text-gray-700 rounded-lg text-sm font-medium border border-gray-300 transition"
          >
            Export
          </button>
        </div>

        <table className="w-full min-w-[900px] text-[14px] text-gray-700 text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">KATEGORI</th>
              <th className="py-5 px-4">LOKASI</th>
              <th className="py-5 px-4">KONDISI</th>
              <th className="py-5 px-4">STATUS</th>
              <th className="py-5 px-4">TANGGAL PEROLEHAN</th>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className="border-b border-b-gray-300 hover:bg-gray-50">
                  <td className="py-5 px-4">{item.id}</td>
                  <td className="py-5 px-4">{item.name}</td>
                  <td className="py-5 px-4">{item.category}</td>
                  <td className="py-5 px-4">{item.location}</td>
                  <td className={`py-5 px-4 ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </td>
                  <td className="py-5 px-4">
                    <span className={getStatusStyle(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    {item.date.split("-").reverse().join(" - ")}
                  </td>
                  <td className="py-5 px-4">{item.dinas}</td>
                  <td className="py-5 px-4">
                    <a
                      href={`/laporan/aset-admin/${item.id}`}
                      className="text-[#0095E8] font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-5 text-gray-500 italic">
                  Tidak ada data yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ======================= MOBILE CARD ======================= */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="border bg-white border-gray-200 rounded-xl shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-500">{item.id}</p>
              <a
                href={`/aset/${item.id}`}
                className="text-[#0095E8] text-sm font-medium hover:underline"
              >
                Detail
              </a>
            </div>

            <h3 className="font-semibold border-b pb-2 mb-3">
              {item.name}
            </h3>

            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Kategori</span>
                <span>{item.category}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Lokasi</span>
                <span>{item.location}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Dinas</span>
                <span>{item.dinas}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Kondisi</span>
                <span className={getConditionColor(item.condition)}>
                  {item.condition}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={getStatusStyle(item.status)}>
                  {item.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal</span>
                <span>
                  {item.date.split("-").reverse().join(" - ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================= PAGINATION FOOTER ======================= */}
      {totalData > 0 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Menampilkan <strong>{startIndex + 1}</strong>–
            <strong>{endIndex}</strong> dari <strong>{totalData}</strong> hasil
          </p>

          <div className="flex items-center gap-2 mx-auto">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {"<"}
            </button>

            {/* Page numbers */}
            {generatePageNumbers().map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === "number" && handlePageChange(p)}
                disabled={p === "..."}
                className={`px-3 py-1 rounded-lg text-sm 
                  ${
                    p === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }
                  ${p === "..." ? "cursor-default text-gray-500" : ""}
                `}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </div>
  );
}
