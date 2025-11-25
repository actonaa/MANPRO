import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import RisikoSetuju from "../../components/form/verifikator/RisikoSetuju";
import RisikoTolak from "../../components/form/verifikator/RisikoTolak";

type TableRisikoProps = {
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
  asset?: { id: string | null; name: string | null; lokasi: string | null };
  department?: { name: string | null };
};

type ApiRisk = {
  id: string;
  title: string;
  criteria: string;
  entry_level: number;
  approval_status: string;
  created_at: string;
  asset_info: { id: string | null; name: string | null };
  risk_category: { name: string };
  department: { name: string } | null;
};

export default function TableRisiko({
  selectedLevel = "",
  selectedDate = null,
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [selectedRisiko, setSelectedRisiko] = useState<RisikoItem | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // jumlah item per halaman

  useEffect(() => {
    const fetchRisks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const resRisks = await axios.get<ApiRisk[]>(
          "https://asset-risk-management.vercel.app/api/risks",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const pendingRisks = resRisks.data.filter(
          (r) => r.approval_status.toLowerCase() === "pending"
        );

        const mappedRisks: RisikoItem[] = pendingRisks.map((r) => ({
          id: r.id,
          date: r.created_at.split("T")[0],
          title: r.title,
          criteria: r.criteria,
          category: r.risk_category?.name || "-",
          entry_level: r.entry_level,
          asset: r.asset_info
            ? {
                id: r.asset_info.id,
                name: r.asset_info.name,
                lokasi: null,
              }
            : undefined,
          department: r.department ? { name: r.department.name } : undefined,
        }));

        setData(mappedRisks);
      } catch (error) {
        console.error("Gagal fetch risiko:", error);
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

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleApproveClick = (item: RisikoItem) => {
    setSelectedRisiko(item);
    setShowApproveModal(true);
  };

  const handleRejectClick = (item: RisikoItem) => {
    setSelectedRisiko(item);
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedRisiko) return;
    setApproveLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `https://asset-risk-management.vercel.app/api/risks/${selectedRisiko.id}/verify`,
        { approval_status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) => prev.filter((r) => r.id !== selectedRisiko.id));
      setShowApproveModal(false);
      setSelectedRisiko(null);
    } catch (error) {
      console.error("Gagal menyetujui risiko:", error);
    } finally {
      setApproveLoading(false);
    }
  };

  const confirmReject = async (notes: string) => {
    if (!selectedRisiko) return;
    setApproveLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `https://asset-risk-management.vercel.app/api/risks/${selectedRisiko.id}/verify`,
        {
          approval_status: "rejected",
          revision_notes: notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) => prev.filter((r) => r.id !== selectedRisiko.id));
      setShowRejectModal(false);
      setSelectedRisiko(null);
    } catch (error) {
      console.error("Gagal menolak risiko:", error);
    } finally {
      setApproveLoading(false);
    }
  };

  return (
    <div className="md:pb-10 lg:bg-white lg:shadow-xl lg:p-5 lg:rounded-2xl relative">
      {/* TABEL DESKTOP */}
      <div className="hidden lg:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">KATEGORI RISK</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">{item.date}</td>
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.asset?.name || "-"}</td>
                <td className="py-5 px-4">{item.title}</td>
                <td
                  className={`py-5 px-4 font-semibold ${
                    item.criteria === "High"
                      ? "text-red-500"
                      : item.criteria === "Medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {item.criteria}
                </td>
                <td className="py-5 px-4">{item.category}</td>
                <td className="py-5 px-4">{item.entry_level}</td>
                <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                  <a
                    href="/risiko-verifikator/detail"
                    className="hover:text-blue-600"
                  >
                    <Eye size={18} />
                  </a>
                  <button
                    onClick={() => handleApproveClick(item)}
                    className="hover:text-green-600"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleRejectClick(item)}
                    className="hover:text-red-600"
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {item.asset?.name || "-"}
            </p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium">Level:</span>{" "}
                <span
                  className={`${
                    item.criteria === "High"
                      ? "text-red-500"
                      : item.criteria === "Medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  } font-semibold`}
                >
                  {item.criteria}
                </span>
              </p>
              <p>
                <span className="font-medium">Kategori Risk:</span>{" "}
                {item.category}
              </p>
              <p>
                <span className="font-medium">Skor:</span> {item.entry_level}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4 text-gray-500">
              <a
                href="/risiko-verifikator/detail"
                className="hover:text-blue-600"
              >
                <Eye size={18} />
              </a>
              <button
                onClick={() => handleApproveClick(item)}
                className="hover:text-green-600"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleRejectClick(item)}
                className="hover:text-red-600"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="w-full mt-4">
          <div className="hidden lg:block">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse grid grid-cols-8 gap-4 py-3 border-b border-b-gray-200"
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            ))}
          </div>

          <div className="lg:hidden grid grid-cols-1 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-4 border border-gray-200 rounded-xl"
              >
                <div className="h-3 w-24 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded mb-4"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>

                <div className="flex gap-3 mt-4">
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POPUP */}
      {showApproveModal && selectedRisiko && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <RisikoSetuju
            asetId={selectedRisiko.asset?.id || ""}
            namaRisiko={selectedRisiko.title}
            asetTerkait={selectedRisiko.asset?.name || "-"}
            onCancel={() => setShowApproveModal(false)}
            onConfirm={confirmApprove}
            loading={approveLoading}
          />
        </div>
      )}

      {showRejectModal && selectedRisiko && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <RisikoTolak
            namaRisiko={selectedRisiko.title}
            asetTerkait={selectedRisiko.asset?.name || "-"}
            onCancel={() => setShowRejectModal(false)}
            onConfirm={confirmReject}
          />
        </div>
      )}

      {/* XYZ + PAGINATION */}
      <div className="mt-6 text-sm text-gray-600 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* XYZ Info */}
        <p className="text-center lg:text-left">
          Menampilkan {totalItems === 0 ? 0 : startIndex + 1} dari {totalItems}{" "}
          hasil
        </p>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 disabled:text-gray-300"
          >
            &lt;
          </button>

          {/* Page Numbers with Ellipsis */}
          {(() => {
            const pages: (number | string)[] = [];

            if (totalPages <= 5) {
              // Show all if <= 5 pages
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              // Always show 1
              pages.push(1);

              // Show dots if currentPage is far from 2
              if (currentPage > 3) pages.push("...");

              // Show middle window
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              for (let i = start; i <= end; i++) pages.push(i);

              // Trailing dots
              if (currentPage < totalPages - 2) pages.push("...");

              // Always show last page
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
        <div></div>
      </div>
    </div>
  );
}
