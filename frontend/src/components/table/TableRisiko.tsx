/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

type TableRisikoProps = {
  searchTerm?: string;
  selectedStatus?: string;
  selectedKategori?: string; // TI / Non-TI
};

type RisikoItem = {
  id: string;
  title: string;
  type: string; // kategori TI / Non-TI dari assets
  criteria: string;
  priority: string;
  status: string;
  entry_level: number;
  asset: { name: string; lokasi?: string };
  department: { name: string };
};

export default function TableRisiko({
  searchTerm = "",
  selectedStatus = "",
  selectedKategori = "",
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // ============================================================
  // FETCH RISIKO + FETCH ASET UTAMA
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // GET RISKS
        const riskRes = await fetch("/api/risks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!riskRes.ok) throw new Error("Gagal memuat data risiko");

        const risks = await riskRes.json();

        // GET ASSETS
        const assetRes = await fetch("/api/assets", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!assetRes.ok) throw new Error("Gagal memuat data aset");

        const assets = await assetRes.json();

        // Map assets ke bentuk dictionary biar cepat dipanggil
        const assetMap: Record<string, any> = {};
        assets.forEach((a: any) => {
          assetMap[a.id] = a;
        });

        // Gabungkan RISKS + CATEGORY dari ASSETS
        const mapped = risks.map((item: any) => {
          const assetInfo = item.asset_info;
          const fullAsset = assetMap[item.asset_id];

          return {
            id: item.id,
            title: item.title,
            type: fullAsset?.category?.name || "-", // TI / Non-TI
            criteria: item.criteria || "-",
            priority: item.risk_category?.name || "-",
            status: item.approval_status || item.status || "-",
            entry_level: item.entry_level || 0,

            asset: {
              name: assetInfo?.name || "-",
              lokasi: fullAsset?.lokasi || "-",
            },

            department: {
              name: item.department?.name || "-",
            },
          };
        });

        setData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================
  // BADGE COLOR
  // ============================================================
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
      case "tinggi":
        return "bg-red-100 text-red-600";
      case "medium":
      case "sedang":
        return "bg-yellow-100 text-yellow-600";
      case "low":
      case "rendah":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "planned":
      case "new":
      case "in progress":
        return "bg-blue-100 text-blue-600";
      case "rejected":
        return "bg-gray-300 text-gray-900";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus
      ? item.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    const matchesKategori = selectedKategori
      ? item.type.toLowerCase() === selectedKategori.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesKategori;
  });

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // LOADING
  if (loading)
    return <p className="text-center text-gray-500 py-6">Memuat data...</p>;

  return (
    <div>
      {/* ======================================================
          📱 MOBILE VERSION
      ====================================================== */}
      <div className="lg:hidden mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-4 bg-white shadow-sm border border-gray-200"
            >
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-500">
                  {item.id.slice(0, 8).toUpperCase()}
                </p>
                <a
                  href={`/risiko/${item.id}`}
                  className="text-[#0095E8] text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>

              <h3 className="font-semibold text-gray-800 text-[15px] mb-3 border-b pb-2 border-gray-300">
                {item.title}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Aset</span>
                  <span className="text-gray-700">{item.asset.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-700">{item.type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Level</span>
                  <span
                    className={`px-3 py-[2px] text-xs rounded-full font-medium ${getLevelColor(
                      item.criteria
                    )}`}
                  >
                    {item.criteria}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-3 py-[2px] text-xs rounded-full font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Skor</span>
                  <span className="text-gray-700">{item.entry_level}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic col-span-2">
            Tidak ada data yang cocok.
          </p>
        )}

        {/* MOBILE PAGINATION */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <PaginationUI
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        <div className="text-sm p-2 text-gray-600 mt-3">
          Menampilkan{" "}
          <span className="font-semibold">
            {filteredData.length === 0 ? 0 : startIndex + 1}
          </span>
          –
          <span className="font-semibold">
            {Math.min(endIndex, filteredData.length)}
          </span>{" "}
          dari <span className="font-semibold">{filteredData.length}</span> data
        </div>
      </div>

      {/* ======================================================
          💻 DESKTOP VERSION
      ====================================================== */}
      <div className="hidden lg:block mt-5 md:mt-0">
        <table className="w-full min-w-[950px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666] border-b border-[#ddd]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
                >
                  <td className="py-5 px-4 text-[#333] font-semibold">
                    {item.id.slice(0, 8).toUpperCase()}
                  </td>

                  <td className="py-5 px-4 text-[#666]">{item.asset.name}</td>

                  <td className="py-5 px-4 text-[#666]">{item.title}</td>

                  <td className="py-5 px-4 text-[#666]">{item.type}</td>

                  <td className="py-5 px-4">
                    <span
                      className={`px-5 py-2 rounded-[16px] text-sm font-medium ${getLevelColor(
                        item.criteria
                      )}`}
                    >
                      {item.criteria}
                    </span>
                  </td>

                  <td className="py-5 px-4">
                    <span
                      className={`px-5 py-2 rounded-[16px] text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-5 px-4 text-[#666]">{item.entry_level}</td>

                  <td className="py-5 px-4">
                    <a
                      href={`/risiko/${item.id}`}
                      className="text-[#0095E8] font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredData.length > ITEMS_PER_PAGE && (
          <PaginationUI
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        <div className="text-sm p-2 text-gray-600 mt-3">
          Menampilkan{" "}
          <span className="font-semibold">
            {filteredData.length === 0 ? 0 : startIndex + 1}
          </span>
          –
          <span className="font-semibold">
            {Math.min(endIndex, filteredData.length)}
          </span>{" "}
          dari <span className="font-semibold">{filteredData.length}</span> data
        </div>
      </div>
    </div>
  );
}

// PAGINATION COMPONENT
function PaginationUI({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (value: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 py-5">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-2 text-lg ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:text-blue-600"
        }`}
      >
        ‹
      </button>

      {(() => {
        const pages: (number | string)[] = [];
        const curr = currentPage;
        const total = totalPages;

        const add = (p: number | string) => {
          if (pages[pages.length - 1] !== p) pages.push(p);
        };

        add(1);
        if (curr > 3) add("…");

        for (let i = curr - 1; i <= curr + 1; i++) {
          if (i > 1 && i < total) add(i);
        }

        if (curr < total - 2) add("…");
        if (total > 1) add(total);

        return pages.map((p, i) =>
          p === "…" ? (
            <span key={i} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={i}
              onClick={() => setCurrentPage(p as number)}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                currentPage === p
                  ? "bg-gray-200 text-black font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {p}
            </button>
          )
        );
      })()}

      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
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
  );
}
