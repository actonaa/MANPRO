/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore, ChevronLeft, ChevronRight } from "lucide-react";
import AuditorModal from "../auditor/AuditorModal";
import type { ModalRisikoData } from "../auditor/AuditorModal";
import type { RisikoItem as RisikoType } from "../auditor/AuditorModal";

type Filters = {
  search: string;
  date: { start: string; end: string };
};

// RisikoItem final setelah mapping API → table
type RisikoItem = RisikoType & {
  id: string;
  title: string;
  date: string;
  criteria: string;
  category: string;
  status: string;
  entry_level: number;
  asset: { name: string; lokasi?: string };
  department: { name: string };
  priority: string;
};

export default function LaporanRiskVerif({ filters }: { filters: Filters }) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState<ModalRisikoData | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const token = localStorage.getItem("token");

  // ============================
  // FETCH DATA FROM API
  // ============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/risks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();

        const mapped: RisikoItem[] = json.map((item: any) => ({
          id: item.id,
          title: item.title,
          criteria: item.criteria || "-",
          category: item.risk_category?.name || "-",
          status: item.approval_status || "-",
          entry_level: item.entry_level || 0,
          priority: item.priority || "-",
          date: item.created_at,
          asset: { name: item.asset_info?.name || "-" },
          department: { name: item.department?.name || "-" },
        }));

        setData(mapped);
      } catch (e) {
        console.error("Error fetching risks:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // ============================
  // MODAL HANDLING
  // ============================
  const openCommentModal = (item: RisikoItem) => {
    const mappedData: ModalRisikoData = {
      id: item.id,
      title: item.title,
      asset_info: {
        name: item.asset?.name || "-",
      },
    };

    setSelectedData(mappedData);
    setOpenModal(true);
  };

  const handleSubmitComment = (comment: string) => {
    console.log("Komentar auditor:", comment);
    console.log("Untuk risiko:", selectedData);

    alert(`Komentar terkirim:\n${comment}`);
    setOpenModal(false);
    setSelectedData(null);
  };

  // ============================
  // FILTER
  // ============================
  const filteredData = data.filter((item) => {
    const { search, date } = filters;

    const matchSearch = search
      ? item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.asset.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchDate =
      date.start && date.end
        ? new Date(item.date) >= new Date(date.start) &&
          new Date(item.date) <= new Date(date.end)
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

  // ============================
  // SKELETON LOADING
  // ============================
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {/* Desktop skeleton */}
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

        {/* Mobile skeleton */}
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
  const startIndex = indexFirst + 1;
  const endIndex = Math.min(indexLast, totalItems);

  return (
    <div>
      {/* DESKTOP TABLE */}
      <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID RISIKO</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">NAMA RISIKO</th>
              <th className="py-5 px-4">LEVEL</th>
              <th className="py-5 px-4">SKOR</th>
              <th className="py-5 px-4">KATEGORI</th>
              <th className="py-5 px-4">STATUS</th>
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
                <td className="py-5">{item.department.name}</td>
                <td className="py-5">{item.id}</td>
                <td className="py-5">{item.asset.name}</td>
                <td className="py-5">{item.title}</td>
                <td
                  className={`py-5 font-semibold ${
                    item.criteria === "High"
                      ? "text-red-500"
                      : item.criteria === "Medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {item.criteria}
                </td>
                <td className="py-5">{item.entry_level}</td>
                <td className="py-5">{item.category}</td>
                <td className="py-5">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      item.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-5">
                  <Link
                    to={`/laporan/risiko-auditor/${item.id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Detail
                  </Link>
                </td>
                <td className="py-5">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => openCommentModal(item)}
                  >
                    <MessageCircleMore className="w-5 h-5 text-gray-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER — INFO & PAGINATION */}
        <div className="flex justify-between items-center pt-5">
          {/* LEFT: info */}
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex}-{endIndex} dari {totalItems} data
          </p>

          {/* CENTER: pagination */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
            >
              <ChevronLeft size={16} />
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
                      className={`px-3 py-1 rounded-lg text-sm ${
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
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* right empty for spacing */}
          <div className="w-24" />
        </div>
      </div>

      {/* MOBILE TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden mt-4">
        {currentData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white relative"
          >
            <button
              className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
              onClick={() => openCommentModal(item)}
            >
              <MessageCircleMore className="w-5 h-5 text-gray-800" />
            </button>

            <p className="text-sm text-gray-500 mb-1">{item.date}</p>
            <h3 className="text-base font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.asset.name}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex justify-between">
                <span>ID Risiko</span>
                <span>{item.id}</span>
              </p>

              <p className="flex justify-between">
                <span>Level</span>
                <span
                  className={
                    item.criteria === "High"
                      ? "text-red-500 font-semibold"
                      : item.criteria === "Medium"
                      ? "text-orange-500 font-semibold"
                      : "text-green-500 font-semibold"
                  }
                >
                  {item.criteria}
                </span>
              </p>

              <p className="flex justify-between">
                <span>Kategori</span>
                <span>{item.category}</span>
              </p>

              <p className="flex justify-between">
                <span>Skor</span>
                <span>{item.entry_level}</span>
              </p>

              <div className="flex justify-between items-center pt-2">
                <Link
                  to={`/laporan/risiko-auditor/${item.id}`}
                  className="text-blue-600 font-medium hover:underline text-sm"
                >
                  Detail
                </Link>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    item.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : item.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE PAGINATION */}
      <div className="flex justify-between items-center mt-4 xl:hidden px-1">
        <p className="text-sm text-gray-600">
          {startIndex}-{endIndex} dari {totalItems} data
        </p>
        <div className="flex gap-3">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            &lt;
          </button>
          <span className="text-sm">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* MODAL */}
      <AuditorModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitComment}
        data={selectedData}
      />
    </div>
  );
}
