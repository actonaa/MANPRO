import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// ========================
// 🟦 TYPE DEFINITIONS
// ========================
type User = {
  nama: string;
  email: string;
};

type AuditLog = {
  id: string;
  tanggal: string;
  pengguna?: User;
  modul: string;
  aksi: string;
  detail: string;
  ip_address: string;
};

type Filter = {
  search: string;
  date?: { start: string; end: string };
};

type TableAuditProps = {
  filters: Filter;
};

type FormattedAudit = {
  id: string;
  date: string;
  dinas: string;
  modul: string;
  aksi: string;
  detail: string;
  ip: string;
};

// ========================
// 🔹 HELPER
// ========================
const truncate = (text: string, maxLength = 30) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

// ========================
// 🔹 COMPONENT
// ========================
export default function TableAudit({ filters }: TableAuditProps) {
  const [data, setData] = useState<FormattedAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<FormattedAudit | null>(null);

  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  // ======================== Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<AuditLog[]>(
          "https://asset-risk-management.vercel.app/api/audit-logs",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const formatted: FormattedAudit[] = res.data.map((item) => ({
          id: item.id,
          date: item.tanggal,
          dinas: item.pengguna?.nama || "-",
          modul: item.modul,
          aksi: item.aksi,
          detail: item.detail,
          ip: item.ip_address || "-",
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ======================== Filtering
  const filtered = data.filter((item) => {
    const s = filters?.search?.toLowerCase() || "";

    const matchSearch =
      !s ||
      item.dinas.toLowerCase().includes(s) ||
      item.modul.toLowerCase().includes(s) ||
      item.aksi.toLowerCase().includes(s) ||
      item.detail.toLowerCase().includes(s) ||
      item.ip.toLowerCase().includes(s);

    const matchDate =
      filters?.date?.start && filters?.date?.end
        ? new Date(item.date) >= new Date(filters.date.start) &&
          new Date(item.date) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  // ======================== Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex - 1, endIndex);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-gray-700 font-semibold">Aktivitas Sistem Terkini</h2>

      {/* Desktop Table */}
      <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-[#EDEDED] p-5">
        <table className="w-full min-w-[1200px] text-[14px] text-left border-collapse">
          <thead className="text-[#666] border-b border-[#EDEDED]">
            <tr>
              <th className="py-4 px-2 font-semibold">Tanggal & Waktu</th>
              <th className="py-4 font-semibold">NAMA PENGGUNA</th>
              <th className="py-4 px-2 font-semibold">MODUL</th>
              <th className="py-4 px-2 font-semibold">AKSI</th>
              <th className="py-4 font-semibold w-[200px]">DETAIL</th>
              <th className="py-4 px-2 font-semibold">IP Address</th>
              <th className="py-4 px-2 font-semibold w-[150px]"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#EDEDED] last:border-0 hover:bg-gray-50 transition"
              >
                <td className="py-5 px-2 font-medium text-gray-800 whitespace-nowrap">
                  {new Date(item.date).toLocaleString("id-ID")}
                </td>
                <td className="py-5 text-gray-700 whitespace-nowrap">
                  {item.dinas}
                </td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">
                  {item.modul}
                </td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">
                  {item.aksi}
                </td>
                <td className="py-5 text-gray-700 leading-relaxed max-w-[200px] truncate">
                  {truncate(item.detail, 50)}
                </td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">
                  {item.ip}
                </td>
                <td className="py-5 px-2 text-gray-700 whitespace-nowrap w-[100px]">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pt-5">
          <p className="text-sm text-gray-600 mb-3">
            Menampilkan {startIndex}–{endIndex} dari {filtered.length} data
          </p>

          <div className="flex justify-center items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page 1 */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              1
            </button>

            {/* Left … */}
            {currentPage > 3 && <span className="px-2">...</span>}

            {/* Current - 1 */}
            {currentPage > 2 && currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
              >
                {currentPage - 1}
              </button>
            )}

            {/* Current */}
            {currentPage !== 1 && currentPage !== totalPages && (
              <button className="px-3 py-1 rounded-lg text-sm bg-blue-600 text-white">
                {currentPage}
              </button>
            )}

            {/* Current + 1 */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
              >
                {currentPage + 1}
              </button>
            )}

            {/* Right … */}
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}

            {/* Last Page */}
            {totalPages > 1 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {totalPages}
              </button>
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-40 flex items-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Table */}
      <div className="xl:hidden grid grid-cols-1 gap-4">
        {currentData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 bg-white rounded-xl p-4 shadow-sm"
          >
            <p className="text-gray-600 text-sm mb-1">
              {new Date(item.date).toLocaleString("id-ID")}
            </p>

            <div className="text-sm text-gray-800 space-y-1">
              <p>
                <strong>Pengguna:</strong> {item.dinas}
              </p>
              <p>
                <strong>Modul:</strong> {item.modul}
              </p>
              <p>
                <strong>Aksi:</strong> {item.aksi}
              </p>
              <p>
                <strong>Detail:</strong> {item.detail}
              </p>
              <p>
                <strong>IP Address:</strong> {item.ip}
              </p>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setSelectedItem(item)}
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 h-full bg-black/40"
            onClick={() => setSelectedItem(null)}
          />

          <div className="relative bg-white rounded-xl shadow-lg p-6 w-[380px] z-50">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedItem(null)}
            >
              <X size={20} />
            </button>

            <h3 className="text-[18px] font-semibold mb-6 text-gray-800">
              Detail Aktivitas
            </h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500 w-40">Tanggal & Waktu</span>
                <span className="font-medium text-right">
                  {new Date(selectedItem.date).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 w-40">Pengguna</span>
                <span className="font-medium text-right">
                  {selectedItem.dinas}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 w-40">Modul</span>
                <span className="font-medium text-right">
                  {selectedItem.modul}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 w-40">Aksi</span>
                <span className="font-medium text-right">
                  {selectedItem.aksi}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-500 w-40 pt-1">Detail</span>
                <span className="font-medium text-right leading-relaxed">
                  {selectedItem.detail}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 w-40">IP Address</span>
                <span className="font-medium text-right">
                  {selectedItem.ip}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
