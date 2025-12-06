import { useState, useEffect } from "react";
import { MessageCircleMore } from "lucide-react";
import AuditorModal from "../auditor/AuditorModal";

// ======================================================
// 🔵 TYPE DATA API
// ======================================================
type ApiDepartment = { name: string };

type ApiAsset = { barcode: string; department?: ApiDepartment };

type ApiRiskTreatment = { action?: string; strategy?: string };

type ApiRisk = { priority?: string; risk_treatment?: ApiRiskTreatment[] };

type ApiMaintenance = {
  id: string;
  asset?: ApiAsset;
  asset_id?: string;
  type?: string;
  cost?: number | null;
  risk?: ApiRisk;
  scheduled_date?: string | null;
  completion_date?: string | null;
  priority?: string | null;
};

// ======================================================
// 🔵 TYPE DATA TABEL
// ======================================================
type PemeliharaanItem = {
  id: string;
  dinas: string;
  aset_id: string;
  jenis: string;
  biaya: string;
  mitigasi: string;
  jadwal: string;
  realisasi: string;
  prioritas: string;
};

type Props = {
  filters: { search: string; date: { start: string; end: string } };
};

export default function TablePemeliharaanAuditor({ filters }: Props) {
  const [data, setData] = useState<PemeliharaanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<PemeliharaanItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ======================================================
  // 🔥 FETCH DATA API
  // ======================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        console.log("DATA API:", json);

        const mapped: PemeliharaanItem[] = (json as ApiMaintenance[]).map(
          (m) => {
            const biayaSafe = m.cost ?? 0;
            return {
              id: m.id,
              dinas: m.asset?.department?.name || "-",
              aset_id: m.asset_id || "-",
              jenis: m.type || "-",
              biaya: `Rp${biayaSafe.toLocaleString("id-ID")}`,
              mitigasi:
                m.risk?.risk_treatment
                  ?.map((t) => t.action || t.strategy || "")
                  .filter((x) => x !== "")
                  .join("; ") || "-",
              jadwal: m.scheduled_date
                ? new Date(m.scheduled_date).toLocaleDateString("id-ID")
                : "-",
              realisasi: m.completion_date
                ? new Date(m.completion_date).toLocaleDateString("id-ID")
                : "-",
              prioritas: m.risk?.priority || m.priority || "Tidak Ada",
            };
          }
        );

        setData(mapped);
      } catch (err) {
        console.error("Gagal fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ======================================================
  // 🔍 FILTER DATA
  // ======================================================
  const filtered = data.filter((item) =>
    item.aset_id.toLowerCase().includes(filters.search.toLowerCase())
  );

  // ======================================================
  // 🔵 PAGINATION
  // ======================================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ======================================================
  // 🎨 WARNA PRIORITAS
  // ======================================================
  const priorityColor = (level: string) => {
    if (level.toLowerCase() === "tinggi") return "text-red-500 font-semibold";
    if (level.toLowerCase() === "sedang")
      return "text-yellow-600 font-semibold";
    return "text-blue-600 font-semibold";
  };

  // ======================================================
  // 🔵 RENDER
  // ======================================================
  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center py-5 text-gray-600">Memuat data...</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="text-gray-600 border-b border-b-gray-300">
                <tr>
                  <th className="p-3 text-left">DINAS</th>
                  <th className="p-3 text-left">ID ASET</th>
                  <th className="p-3 text-left">JENIS</th>
                  <th className="p-3 text-left">BIAYA</th>
                  <th className="p-3 text-left">MITIGASI</th>
                  <th className="p-3 text-left">JADWAL</th>
                  <th className="p-3 text-left">REALISASI</th>
                  <th className="p-3 text-left">PRIORITAS</th>
                  <th className="p-3 text-left">DETAIL</th>
                  <th className="p-3 text-center"></th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-b border-b-gray-300">
                    <td className="p-3">{item.dinas}</td>
                    <td className="p-3">{item.aset_id}</td>
                    <td className="p-3">{item.jenis}</td>
                    <td className="p-3">{item.biaya}</td>
                    <td className="p-3 max-w-[220px] whitespace-pre-wrap">
                      {item.mitigasi}
                    </td>
                    <td className="p-3">{item.jadwal}</td>
                    <td className="p-3">{item.realisasi}</td>
                    <td className={`p-3 ${priorityColor(item.prioritas)}`}>
                      {item.prioritas}
                    </td>
                    <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                      <a href={`/laporan/Pemeliharaan-auditor/${item.id}`}>Detail</a>
                    </td>
                    <td className="p-3 text-center">
                      <MessageCircleMore
                        className="w-5 h-5 text-gray-600 cursor-pointer"
                        onClick={() => {
                          setSelectedRow(item);
                          setModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* FOOTER */}
            <div className="flex flex-col mt-2 text-sm text-gray-700">
              {/* Menampilkan data di kiri */}
              <div className="mb-2">
                Menampilkan {indexOfFirst + 1}-
                {Math.min(indexOfLast, filtered.length)} dari {filtered.length}{" "}
                hasil
              </div>

              {/* Pagination di tengah */}
              <div className="flex justify-center space-x-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded disabled:opacity-40"
                >
                  &lt;
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL AUDITOR */}
      <AuditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(comment) => {
          console.log("Komentar Auditor:", comment);
          setModalOpen(false);
        }}
        data={
          selectedRow
            ? {
                id: selectedRow.id,
                title: `Pemeliharaan ${selectedRow.aset_id}`,
                asset_info: { name: selectedRow.aset_id },
              }
            : null
        }
      />
    </>
  );
}
