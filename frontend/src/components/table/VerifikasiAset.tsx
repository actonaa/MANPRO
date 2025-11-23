import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import SetujuAsset from "../../components/form/verifikator/setujuAsset";
import TolakAsset from "../../components/form/verifikator/tolakAsset";

type TableProps = {
  selectedkondisi?: string;
  selectedDate?: { start: string; end: string } | null;
};

type AsetItem = {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  tanggal: string;
  pic: string;
  status: string;
};

type ApiAsset = {
  id: string;
  name: string;
  approval_status: string;
  category?: { name: string };
  sub_category?: { name: string };
  condition?: { name: string };
  lokasi?: string;
  acquisition_date?: string;
  deploy_date?: string;
  pic?: string;
  status?: { name: string };
};

export default function VerifikasiAset({
  selectedkondisi = "",
  selectedDate = null,
}: TableProps) {
  const [data, setData] = useState<AsetItem[]>([]);
  const [openSetuju, setOpenSetuju] = useState(false);
  const [openTolak, setOpenTolak] = useState(false);
  const [selectedAset, setSelectedAset] = useState<AsetItem | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedkondisi, selectedDate]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiAsset[]>(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );

        const pendingAssets = res.data.filter(
          (item) => item.approval_status === "pending"
        );

        const mappedData: AsetItem[] = pendingAssets.map((item) => ({
          id: item.id,
          nama: item.name || "-",
          kategori: item.category?.name || "-",
          lokasi: item.lokasi || "-",
          kondisi: item.condition?.name?.toUpperCase() || "-",
          tanggal: item.acquisition_date || item.deploy_date || "-",
          pic: item.pic || "-",
          status: item.status?.name || "Tertunda",
        }));

        setData(mappedData);
      } catch (error) {
        console.error("Error fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [token]);

  const parseDate = (dateStr: string) => new Date(dateStr);

  const formatTanggal = (tanggal: string) => {
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return "-";
    return `${String(d.getDate()).padStart(2, "0")} - ${String(
      d.getMonth() + 1
    ).padStart(2, "0")} - ${d.getFullYear()}`;
  };

  const filteredData = data.filter((item) => {
    const kondisiMatch =
      !selectedkondisi ||
      item.kondisi.toLowerCase().includes(selectedkondisi.toLowerCase());

    const dateMatch =
      !selectedDate ||
      (parseDate(item.tanggal) >= parseDate(selectedDate.start) &&
        parseDate(item.tanggal) <= parseDate(selectedDate.end));

    return kondisiMatch && dateMatch;
  });

  // =========================
  // APPLY PAGINATION
  // =========================
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getKondisiColor = (kondisi: string) => {
    if (kondisi === "BAIK") return "text-green-600";
    if (kondisi.includes("RINGAN")) return "text-orange-500";
    if (kondisi.includes("BERAT")) return "text-red-500";
    return "text-gray-600";
  };

  const handleSetuju = (aset: AsetItem) => {
    setSelectedAset(aset);
    setOpenSetuju(true);
  };

  const handleTolak = (aset: AsetItem) => {
    setSelectedAset(aset);
    setOpenTolak(true);
  };

  if (loading) {
    return (
      <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
        {/* TABLE SKELETON (DESKTOP) */}
        <div className="hidden xl:block overflow-x-auto animate-pulse">
          <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
            <thead>
              <tr>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="py-5 px-4">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="border-b border-b-[#ddd]">
                    {Array(8)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="py-5 px-4">
                          <div className="h-4 w-full bg-gray-200 rounded"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE SKELETON CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden animate-pulse">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
              >
                <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>

                <div className="grid grid-cols-2 gap-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* TABLE DESKTOP */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">PIC</th>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4 font-medium">{item.id}</td>
                <td className="py-5 px-4">{item.nama}</td>
                <td className="py-5 px-4">{item.kategori}</td>
                <td className="py-5 px-4">{item.lokasi}</td>
                <td
                  className={`py-5 px-4 font-semibold ${getKondisiColor(
                    item.kondisi
                  )}`}
                >
                  {item.kondisi}
                </td>
                <td className="py-5 px-4">{item.pic}</td>
                <td className="py-5 px-4">{formatTanggal(item.tanggal)}</td>

                <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                  <Link
                    to={`/aset-verifikator/${item.id}`}
                    className="hover:text-blue-600"
                  >
                    <Eye size={18} />
                  </Link>

                  <button
                    onClick={() => handleSetuju(item)}
                    className="hover:text-green-600"
                  >
                    <CheckCircle size={18} />
                  </button>

                  <button
                    onClick={() => handleTolak(item)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">
              {formatTanggal(item.tanggal)}
            </p>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.nama}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.kategori}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Kondisi:</span>
                <span
                  className={`${getKondisiColor(item.kondisi)} font-semibold`}
                >
                  {" "}
                  {item.kondisi}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Lokasi:</span>{" "}
                {item.lokasi}
              </p>
              <p>
                <span className="font-medium text-gray-700">PIC:</span>{" "}
                {item.pic}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4 text-gray-500">
              <Link
                to={`/aset-verifikator/${item.id}`}
                className="hover:text-blue-600"
              >
                <Eye size={18} />
              </Link>

              <button
                onClick={() => handleSetuju(item)}
                className="hover:text-green-600"
              >
                <CheckCircle size={18} />
              </button>

              <button
                onClick={() => handleTolak(item)}
                className="hover:text-red-600"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NO DATA */}
      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {/* ===========================
          PAGINATION + XYZ 
      ============================ */}
      <div className="mt-6 text-sm text-gray-600 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* XYZ */}
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
        <div></div>
      </div>

      {openSetuju && selectedAset && (
        <SetujuAsset aset={selectedAset} onClose={() => setOpenSetuju(false)} />
      )}

      {openTolak && selectedAset && (
        <TolakAsset aset={selectedAset} onClose={() => setOpenTolak(false)} />
      )}
    </div>
  );
}
