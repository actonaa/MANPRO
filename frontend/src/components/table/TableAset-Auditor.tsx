/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { MessageCircleMore } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
  department?: { name: string };
  condition?: { name: string };
}

export default function TableAset({ filters }: { filters?: any }) {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Asset | null>(null);

  const openComment = (item: Asset) => {
    setSelectedItem(item);
    setCommentOpen(true);
  };
  const closeComment = () => {
    setCommentOpen(false);
    setSelectedItem(null);
  };

  const token = localStorage.getItem("token");

  // ============================
  // FETCH DATA
  // ============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        const mapped: Asset[] = json.map((item: any) => ({
          id: item.id,
          name: item.name,
          serial_number: item.serial_number,
          lokasi: item.lokasi,
          acquisition_date: item.acquisition_date,
          category: item.category,
          status: item.status,
          department: item.department,
          condition: item.condition,
        }));
        setData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // ============================
  // FILTER DATA
  // ============================
  const filteredData = data.filter((item) => {
    if (!filters) return true;

    const keyword = filters.search?.toLowerCase() || "";

    const safe = (v: any) => (typeof v === "string" ? v.toLowerCase() : "");

    const matchSearch =
      !keyword ||
      safe(item.name).includes(keyword) ||
      safe(item.serial_number).includes(keyword) ||
      safe(item.department?.name).includes(keyword) ||
      safe(item.category?.name).includes(keyword);

    const matchDate =
      filters.tanggal?.start && filters.tanggal?.end
        ? new Date(item.acquisition_date) >= new Date(filters.tanggal.start) &&
          new Date(item.acquisition_date) <= new Date(filters.tanggal.end)
        : true;

    return matchSearch && matchDate;
  });

  // ============================
  // PAGINATION
  // ============================
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filteredData.slice(indexFirst, indexLast);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const startIndex = indexFirst + 1;
  const endIndex = Math.min(indexLast, totalItems);

  // ============================
  // BADGES
  // ============================
  const getConditionColor = (c?: { name: string }) => {
    switch (c?.name?.toLowerCase()) {
      case "baik":
        return "text-green-600 font-semibold";
      case "rusak - ringan":
        return "text-yellow-600 font-semibold";
      case "rusak - berat":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (s?: { name: string }) => {
    switch (s?.name) {
      case "Aktif":
        return "bg-green-100 text-green-700";
      case "End-of-life":
        return "bg-red-100 text-red-700";
      case "Perbaikan":
      case "Akan Dihapus":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ============================
  // SKELETON LOADING
  // ============================
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="hidden xl:block">
          <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
            <thead>
              <tr>
                {Array.from({ length: 10 }).map((_, i) => (
                  <th key={i} className="py-5 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j} className="py-5">
                      <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-28 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================
  // RENDER TABLE
  // ============================
  return (
    <div>
      {/* DESKTOP TABLE */}
      <div className="grid grid-cols-1 xl:block bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <table className="hidden xl:table w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">KATEGORI</th>
              <th className="py-5 px-4">LOKASI</th>
              <th className="py-5 px-4">KONDISI</th>
              <th className="py-5 px-4">STATUS</th>
              <th className="py-5 px-4">TANGGAL</th>
              <th className="py-5 px-4"></th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#e5e5e5] hover:bg-gray-50"
              >
                <td className="py-5">{item.department?.name}</td>
                <td className="py-5">{item.id}</td>
                <td className="py-5">{item.name}</td>
                <td className="py-5">{item.category?.name}</td>
                <td className="py-5">{item.lokasi}</td>
                <td className="py-5">
                  <span className={getConditionColor(item.condition)}>
                    {item.condition?.name}
                  </span>
                </td>
                <td className="py-5">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status?.name}
                  </span>
                </td>
                <td className="py-5">{item.acquisition_date}</td>

                {/* LINK DETAIL */}
                <td className="py-5 text-left">
                  <a
                    href={`/laporan/aset-auditor/${item.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Detail
                  </a>
                </td>

                {/* ICON KOMENTAR */}
                <td className="py-5">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => openComment(item)}
                  >
                    <MessageCircleMore className="w-5 h-5 text-gray-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden mt-4">
          {currentData.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white relative"
            >
              <p className="text-sm text-gray-500 mb-1">
                {item.acquisition_date}
              </p>
              <h3 className="text-base font-semibold text-gray-900">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {item.department?.name}
              </p>

              <div className="text-sm text-gray-700 space-y-1">
                <p className="flex justify-between">
                  <span>ID</span>
                  <span>{item.serial_number}</span>
                </p>
                <p className="flex justify-between">
                  <span>Kategori</span>
                  <span>{item.category?.name}</span>
                </p>
                <p className="flex justify-between">
                  <span>Lokasi</span>
                  <span>{item.lokasi}</span>
                </p>
                <p className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status?.name}
                  </span>
                </p>

                {/* LINK DETAIL + ICON KOMENTAR */}
                <div className="flex justify-between items-center pt-2">
                  <a
                    href={`/laporan/aset-auditor/${item.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Detail
                  </a>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => openComment(item)}
                  >
                    <MessageCircleMore className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="relative mt-5 flex items-center">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex}-{endIndex} dari {totalItems} data
          </p>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg disabled:opacity-40"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (n) =>
                  n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1
              )
              .map((n, i, arr) => {
                const prev = arr[i - 1];
                return (
                  <div key={n} className="flex items-center">
                    {prev && n - prev > 1 && <span className="px-2">...</span>}
                    <button
                      onClick={() => setCurrentPage(n)}
                      className={`px-3 py-1 rounded-lg  text-sm ${
                        currentPage === n
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  </div>
                );
              })}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg  disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {commentOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Tambahkan Komentar
            </h2>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:ring focus:ring-blue-200 outline-none"
              placeholder="Tulis komentar di sini..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeComment}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
              >
                Tutup
              </button>
              <button
                onClick={closeComment}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
