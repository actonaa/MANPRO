/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MessageCircleMore, ChevronLeft, ChevronRight } from "lucide-react";
import AuditorModal from "../auditor/AuditorModal";

// 🔥 TYPE UNTUK ITEM SDM
type SDMItem = {
  dinas: string;
  id: string;
  nip: string;
  name: string;
  tugas: string;
  risiko: string;
  date: string;
};

// 🔥 TYPE UNTUK SCENARIO
type ScenarioItem = {
  id: string;
  name: string;
  description: string;
  assets: { id: string; name: string }[];
  owner_position: { name: string };
};

type SDMResponse = {
  message: string;
  data: SDMItem[];
};

type ScenarioResponse = ScenarioItem[];

export default function TableSDM({ filters }: any) {
  const [data, setData] = useState<SDMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SDMItem | null>(null);

  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // ======================================================
  // FETCH SDM + SCENARIOS
  // ======================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [sdmRes, scenarioRes] = await Promise.all([
          axios.get<SDMResponse>(
            "https://sso-user-management.vercel.app/api/hr",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get<ScenarioResponse>(
            "https://asset-risk-management.vercel.app/api/scenarios",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        const sdmList = sdmRes.data.data || [];
        const scenarioList: ScenarioItem[] = scenarioRes.data || [];

        // 🔥 MERGE DATA SDM DENGAN SCENARIO BERDASARKAN POSITION
        const merged = sdmList.map((sdm: any) => {
          const scenarioCocok = scenarioList.find(
            (s) => s.owner_position?.name === sdm.position
          );

          return {
            dinas: sdm.department || "-",
            id: sdm.hr_id || "-",
            nip: sdm.nip || "-",
            name: sdm.name || "-",
            tugas: scenarioCocok?.description || "-",
            risiko: scenarioCocok?.name || "-",
            date: new Date().toISOString(),
          };
        });

        setData(merged);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ==========================
  // Modal
  // ==========================
  const openModal = (item: SDMItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (comment: string) => {
    console.log("Komentar:", comment, selectedItem);
    setIsModalOpen(false);
  };

  // ==========================
  // Filter & Pagination
  // ==========================
  const filtered = data.filter((item) => {
    const s = filters.search.toLowerCase();
    const matchSearch =
      !filters.search ||
      item.id.toLowerCase().includes(s) ||
      item.name.toLowerCase().includes(s) ||
      item.nip.toLowerCase().includes(s);

    const matchDate =
      filters.date.start && filters.date.end
        ? new Date(item.date) >= new Date(filters.date.start) &&
          new Date(item.date) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const startIndex = totalItems === 0 ? 0 : indexFirst + 1;
  const endIndex = Math.min(indexLast, totalItems);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // ==========================
  // Loading & Empty State
  // ==========================
  if (loading) return <p className="p-6">Loading...</p>;
  if (!data.length)
    return <p className="text-red-500 p-6">Data SDM tidak ditemukan.</p>;

  // ==========================
  // Render Table
  // ==========================
  return (
    <div className="w-full">
      <div className="hidden xl:block bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-center border-collapse text-[13px]">
          <thead className="text-gray-600">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID SDM</th>
              <th className="py-5 px-4">NIP</th>
              <th className="py-5 px-4">NAMA</th>
              <th className="py-5 px-4">TUGAS</th>
              <th className="py-5 px-4">SKENARIO</th>
              <th className="py-5 px-4"></th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-5 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
                  {item.dinas}
                </td>
                <td className="py-5 max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                  {item.id}
                </td>
                <td className="py-5 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
                  {item.nip}
                </td>
                <td className="py-5 max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                  {item.name}
                </td>
                <td className="py-5 max-w-[250px] truncate overflow-hidden whitespace-nowrap">
                  {item.tugas}
                </td>
                <td className="py-5 max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                  {item.risiko}
                </td>
                <td className="py-5">
                  <Link
                    to="/laporan/sdm-auditor/id"
                    className="text-blue-600 hover:underline font-medium"
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

        {/* Pagination Footer */}
        <div className="flex justify-between items-center pt-5">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex}–{endIndex} dari {filtered.length} data
          </p>
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
        </div>
      </div>

      {/* Modal */}
      <AuditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        data={
          selectedItem
            ? {
                id: selectedItem.id,
                title: selectedItem.risiko,
                asset_info: { name: "-" }, // ✅ tambahkan ini
              }
            : null
        }
      />
    </div>
  );
}
