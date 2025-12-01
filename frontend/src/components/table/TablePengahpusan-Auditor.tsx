import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore, ChevronLeft, ChevronRight } from "lucide-react";
import AuditorModal from "../auditor/AuditorModal";

export default function TablePenghapusan({ filters }: any) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await response.json();

        const approvedAssets = result.filter(
          (item: any) => item.approval_status === "approved_delete"
        );

        const mappedData = approvedAssets.map((item: any) => ({
          dinas: item.department?.name || "-",
          id: item.id,
          name: item.name,
          reason: item.revision_notes || "-",
          value: item.acquisition_value
            ? `Rp${item.acquisition_value.toLocaleString()}`
            : "-",
          date_delete: item.updated_at
            ? new Date(item.updated_at).toISOString().split("T")[0]
            : "-",
        }));

        setData(mappedData);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (comment: string) => {
    console.log("Komentar:", comment);
    console.log("Untuk Aset:", selectedItem);
    setIsModalOpen(false);
  };

  // FILTERING
  const filteredData = data.filter((item) => {
    const s = filters.search.toLowerCase();
    const matchSearch =
      !filters.search ||
      item.id.toLowerCase().includes(s) ||
      item.name.toLowerCase().includes(s);

    const matchDate =
      filters.date.start && filters.date.end
        ? new Date(item.date_delete) >= new Date(filters.date.start) &&
          new Date(item.date_delete) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

 // ============================
// SKELETON LOADING SESUAI TABEL
// ============================
if (isLoading) {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {/* Desktop */}
      <div className="hidden xl:block">
        <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead>
            <tr>
              {["DINAS","ID ASET","NAMA ASET","ALASAN","NILAI ASET","TGL PENGHAPUSAN","",""].map((_, i) => (
                <th key={i} className="py-5 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <tr key={i} className="border-b border-gray-200">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="py-5">
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
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

  return (
    <div>
      {/* DESKTOP TABLE */}
      <div className="hidden xl:block bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">ALASAN</th>
              <th className="py-5 px-4">NILAI ASET</th>
              <th className="py-5 px-4">TGL PENGHAPUSAN</th>
              <th className="py-5 px-4"></th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-5">{item.dinas}</td>
                <td className="py-5">{item.id}</td>
                <td className="py-5">{item.name}</td>
                <td className="py-5">{item.reason}</td>
                <td className="py-5">{item.value}</td>
                <td className="py-5">{item.date_delete}</td>
                <td className="py-5">
                  <Link
                    to={`/laporan/Penghapusan-auditor/${item.id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Detail
                  </Link>
                </td>
                <td className="py-5">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MessageCircleMore className="w-5 h-5 text-gray-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer - TENGAH */}
        <div className="flex justify-center items-center gap-2 pt-5">
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
      </div>

      {/* MOBILE TABLE */}
      <div className="xl:hidden mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedData.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white relative"
            >
              <button
                onClick={() => openModal(item)}
                className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
              >
                <MessageCircleMore className="w-5 h-5 text-gray-800" />
              </button>

              <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.id}</p>

              <div className="text-sm text-gray-700 space-y-1">
                <p className="flex justify-between">
                  <span>Dinas</span>
                  <span>{item.dinas}</span>
                </p>

                <p className="flex justify-between">
                  <span>Alasan</span>
                  <span className="text-right w-[55%]">{item.reason}</span>
                </p>

                <p className="flex justify-between">
                  <span>Nilai</span>
                  <span>{item.value}</span>
                </p>

                <p className="flex justify-between">
                  <span>Tgl Hapus</span>
                  <span>{item.date_delete}</span>
                </p>

                <div className="flex justify-end pt-3">
                  <Link
                    to={`/laporan/Penghapusan-auditor/${item.id}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP AUDITOR */}
      <AuditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        data={selectedItem}
      />
    </div>
  );
}
