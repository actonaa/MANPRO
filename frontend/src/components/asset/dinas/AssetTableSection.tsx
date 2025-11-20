import { useEffect, useState, useMemo } from "react";
import axios from "axios";

type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  status: string;
  date: string;
  dinas?: string;
};

const ITEMS_PER_PAGE = 5;

const getConditionColor = (condition: string) => {
  if (condition.toUpperCase() === "BAIK") return "text-green-600 font-semibold";
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
  period?: string;
  category?: string;
  condition?: string;
  searchValue?: string;
}

export default function AssetTableSection({
  period,
  category,
  condition,
  searchValue,
}: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mapped = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category?.name || "-",
          location: item.lokasi,
          condition: item.condition?.name || "-",
          status: item.status?.name || "-",
          date: item.acquisition_date,
        }));

        setAssets(mapped);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data aset.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Filter
  const filteredData = useMemo(() => {
    return assets.filter((item) => {
      const matchPeriod = period ? item.date === period : true;
      const matchCategory = category ? item.category === category : true;
      const matchCondition = condition ? item.condition === condition : true;
      const matchSearch = searchValue
        ? item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.category.toLowerCase().includes(searchValue.toLowerCase())
        : true;

      return matchPeriod && matchCategory && matchCondition && matchSearch;
    });
  }, [assets, period, category, condition, searchValue]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 1) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= maxVisible) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
      pages.push(-1);
      pages.push(totalPages);
    } else if (currentPage >= totalPages - maxVisible + 1) {
      pages.push(1);
      pages.push(-1);
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">Memuat data aset...</p>
    );
  if (error) return <p className="text-center py-5 text-red-500">{error}</p>;

  return (
    <div className="mt-5">
      {/* Mobile & Tablet */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[15px] text-gray-800 truncate">
                  {item.name}
                </h3>
                <a
                  href={`/aset/${item.id}`}
                  className="text-blue-500 text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>
              <p className="text-sm text-gray-500 mb-3 truncate">{item.id}</p>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Kategori</span>
                  <span className="text-gray-800">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lokasi</span>
                  <span className="text-gray-800">{item.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={getStatusStyle(item.status)}>
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kondisi</span>
                  <span className={getConditionColor(item.condition)}>
                    {item.condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal</span>
                  <span className="text-gray-800">{item.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 italic">
            Tidak ada data yang cocok.
          </p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-5 px-4">{item.id}</td>
                  <td className="py-5 px-4">{item.name}</td>
                  <td className="py-5 px-4">{item.category}</td>
                  <td className="py-5 px-4">{item.location}</td>
                  <td
                    className={`py-5 px-4 ${getConditionColor(item.condition)}`}
                  >
                    {item.condition}
                  </td>
                  <td className="py-5 px-4">{item.status}</td>
                  <td className="py-5 px-4">{item.date}</td>
                  <td className="py-5 px-4">
                    <a
                      href={`/aset/${item.id}`}
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-5 text-gray-500 italic">
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* XYZ + Pagination */}
        <div className="grid grid-cols-3 items-center px-5 py-4">
          {/* Kiri */}
          <div className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">
              {filteredData.length === 0 ? 0 : startIndex + 1}
            </span>
            –
            <span className="font-semibold">
              {Math.min(endIndex, filteredData.length)}
            </span>{" "}
            dari <span className="font-semibold">{filteredData.length}</span>{" "}
            aset
          </div>

          {/* Tengah - Pagination */}
          <div className="flex justify-center">
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
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

                {getPageNumbers().map((p, idx) =>
                  p === -1 ? (
                    <span key={idx} className="px-2 text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                        currentPage === p
                          ? "bg-gray-200 text-black font-semibold"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
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

          {/* Kanan */}
          <div></div>
        </div>
      </div>
    </div>
  );
}
