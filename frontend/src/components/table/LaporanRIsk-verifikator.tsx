import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

type LaporanRiskVerifProps = {
  selectedLevel?: string;
  selectedDate?: { start: string; end: string } | null;
};

type RisikoItem = {
  id: string;
  date: string;
  title: string;
  criteria: string;
  category: string;
  entry_level: number;
  asset: { name: string; lokasi: string };
  department: { name: string };
};

export default function LaporanRiskVerif({
  selectedLevel = "",
  selectedDate = null,
}: LaporanRiskVerifProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan di localStorage");

        const response = await axios.get(
          "https://asset-risk-management.vercel.app/api/risks",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const risks: RisikoItem[] = response.data.map((item: any) => ({
          id: item.id,
          date: item.created_at.split("T")[0],
          title: item.title,
          criteria:
            item.criteria === "Low"
              ? "Rendah"
              : item.criteria === "Medium"
              ? "Sedang"
              : item.criteria === "High"
              ? "Tinggi"
              : "-",
          category: item.risk_category?.name || "-",
          entry_level: item.entry_level,
          asset: {
            name: item.asset_info?.name || "-",
            lokasi: item.asset_info?.lokasi || "-",
          },
          department: { name: item.department?.name || "-" },
        }));

        setData(risks);
      } catch (error) {
        console.error("Gagal fetch data risiko:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesLevel = selectedLevel
      ? item.criteria.toLowerCase() === selectedLevel.toLowerCase()
      : true;

    const matchesDate = selectedDate
      ? item.date >= selectedDate.start && item.date <= selectedDate.end
      : true;

    return matchesLevel && matchesDate;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getCriteriaColor = (criteria: string) => {
    if (criteria === "Tinggi") return "text-red-500";
    if (criteria === "Sedang") return "text-orange-500";
    return "text-green-500";
  };

  if (loading)
    return <p className="text-center py-6">Loading data risiko...</p>;

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* Desktop Table */}
      <div className="hidden xl:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">{item.date}</td>
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.asset.name}</td>
                <td className="py-5 px-4">{item.title}</td>
                <td
                  className={`py-5 px-4 font-semibold ${getCriteriaColor(
                    item.criteria
                  )}`}
                >
                  {item.criteria}
                </td>
                <td className="py-5 px-4">{item.category}</td>
                <td className="py-5 px-4">{item.entry_level}</td>
                <td className="py-5 px-4 flex items-center justify-center text-gray-500">
                  <Link
                    to={`/laporan/risiko-verifikator/${item.id}`}
                    className="hover:text-blue-600"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-6 text-sm text-gray-600 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Info data */}
          <div className="text-center lg:text-left">
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1} dari{" "}
            {totalItems} hasil
          </div>

          {/* Center: Pagination */}
          <div className="flex justify-center items-center gap-2 w-full lg:w-auto">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 disabled:text-gray-300"
            >
              &lt;
            </button>

            {/* Page numbers */}
            {(() => {
              const pages: (number | string)[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("...");
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((page, idx) =>
                typeof page === "string" ? (
                  <span key={idx} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 disabled:text-gray-300"
            >
              &gt;
            </button>
          </div>

          {/* Right: Kosong atau bisa ditambahkan konten lain */}
          <div className="hidden lg:block w-24"></div>
        </div>
      </div>

      {/* Mobile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {currentData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.asset.name}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Level:</span>{" "}
                <span
                  className={`${getCriteriaColor(item.criteria)} font-semibold`}
                >
                  {item.criteria}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Kategori:</span>{" "}
                {item.category}
              </p>
              <p>
                <span className="font-medium text-gray-700">Skor:</span>{" "}
                {item.entry_level}
              </p>
            </div>

            <div className="flex justify-end mt-4 text-gray-500">
              <Link
                to={`/risiko-verifikator/${item.id}`}
                className="hover:text-blue-600"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}
    </div>
  );
}
