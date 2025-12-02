import { useState, useEffect } from "react";
import { Eye, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import HapusAsetConfirm from "../../components/dashboard/admin/HapusAdmin";

type TableProps = {
  selectedKondisi?: string;
  selectedDate?: { start: string; end: string } | null;
  selectedKategori?: string;
  searchQuery?: string;
};

type AsetItem = {
  id: string;
  name: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  tanggal: string;
  department: string;
};

export default function VerifikasiPenghapusanAdmin({
  selectedKondisi = "",
  selectedDate = null,
  selectedKategori = "",
  searchQuery = "",
}: TableProps) {
  const [data, setData] = useState<AsetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openHapus, setOpenHapus] = useState(false);
  const [selectedAset, setSelectedAset] = useState<AsetItem | null>(null);

  // ============================ FETCH API ============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://asset-risk-management.vercel.app/api/assets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res || !Array.isArray(res)) return;

        const formatted = res
          .filter((item) => item.approval_status === "verified_delete")
          .map((item) => ({
            id: item.id,
            name: item.name,
            kategori: item.category?.name || "-",
            lokasi: item.lokasi || "-",
            kondisi: item.condition?.name || "-",
            tanggal: item.acquisition_date,
            department: item.department?.name || "-",
          }));

        setData(formatted);
      })
      .catch((e) => console.error("Error fetching assets:", e))
      .finally(() => setLoading(false));
  }, []);

  const parseDate = (dateStr: string) => new Date(dateStr);

  const formatTanggal = (tanggal: string) => {
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return "-";
    return `${String(d.getDate()).padStart(2, "0")} - ${String(
      d.getMonth() + 1
    ).padStart(2, "0")} - ${d.getFullYear()}`;
  };

  // ========================== FILTER LOGIC ==========================
  const filteredData = data.filter((item) => {
    const kondisiMatch =
      !selectedKondisi ||
      item.kondisi.toLowerCase().includes(selectedKondisi.toLowerCase());

    const dateMatch =
      !selectedDate ||
      (parseDate(item.tanggal) >= parseDate(selectedDate.start) &&
        parseDate(item.tanggal) <= parseDate(selectedDate.end));

    const kategoriMatch =
      !selectedKategori ||
      selectedKategori === "Kategori" ||
      item.kategori.toLowerCase() === selectedKategori.toLowerCase();

    const searchMatch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    return kondisiMatch && dateMatch && kategoriMatch && searchMatch;
  });

  const getKondisiColor = (kondisi: string) => {
    if (kondisi.toLowerCase() === "baik") return "text-green-600";
    if (kondisi.toLowerCase().includes("ringan")) return "text-orange-500";
    if (kondisi.toLowerCase().includes("berat")) return "text-red-500";
    return "text-gray-600";
  };

  const handleHapus = (aset: AsetItem) => {
    setSelectedAset(aset);
    setOpenHapus(true);
  };

  // ====================== SKELETON (DESKTOP) =========================
  const SkeletonRow = () => (
    <tr className="border-b border-b-gray-200 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-3 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  // ====================== SKELETON (MOBILE) ==========================
  const SkeletonCard = () => (
    <div className="border p-4 rounded-xl bg-white shadow-sm animate-pulse">
      <div className="h-3 bg-gray-200 w-24 mb-3 rounded"></div>
      <div className="h-4 bg-gray-200 w-40 mb-2 rounded"></div>
      <div className="h-3 bg-gray-200 w-28 mb-2 rounded"></div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // ============================ RENDER ===============================
  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* DESKTOP */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full min-w-[1100px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">DINAS</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              : filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
                  >
                    <td className="py-5 px-4 font-medium">{item.id}</td>
                    <td className="py-5 px-4">{item.name}</td>
                    <td className="py-5 px-4">{item.kategori}</td>
                    <td className="py-5 px-4">{item.lokasi}</td>

                    <td
                      className={`py-5 px-4 font-semibold ${getKondisiColor(
                        item.kondisi
                      )}`}
                    >
                      {item.kondisi}
                    </td>

                    <td className="py-5 px-4">{formatTanggal(item.tanggal)}</td>
                    <td className="py-5 px-4">{item.department}</td>

                    <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                      <Link
                        to={`/aset-verifikator/detail/${item.id}`}
                        className="hover:text-blue-600"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() => handleHapus(item)}
                        className="hover:text-red-600"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredData.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <p className="text-sm text-gray-500 mb-1">
                  {formatTanggal(item.tanggal)}
                </p>

                <h3 className="text-base font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500 mb-2">{item.kategori}</p>

                <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
                  <p>
                    <span className="font-medium">ID:</span> {item.id}
                  </p>
                  <p>
                    <span className="font-medium">Kondisi:</span>{" "}
                    <span
                      className={`${getKondisiColor(
                        item.kondisi
                      )} font-semibold`}
                    >
                      {item.kondisi}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Lokasi:</span> {item.lokasi}
                  </p>
                </div>

                <div className="flex justify-end mt-3 gap-3 text-gray-500">
                  <Link
                    to={`/aset-verifikator/detail/${item.id}`}
                    className="hover:text-blue-600"
                  >
                    <Eye size={18} />
                  </Link>

                  <button
                    onClick={() => handleHapus(item)}
                    className="hover:text-red-600"
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* NO DATA */}
      {!loading && filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {/* MODAL DELETE */}
      {openHapus && selectedAset && (
        <HapusAsetConfirm
          aset={selectedAset}
          onClose={() => setOpenHapus(false)}
          onConfirm={async (aset) => {
            try {
              const token = localStorage.getItem("token");

              const res = await fetch(
                `https://asset-risk-management.vercel.app/api/assets/${aset.id}/approve-delete`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ action: "accept" }),
                }
              );

              if (!res.ok) throw new Error("Gagal menghapus aset");

              setData((prev) => prev.filter((x) => x.id !== aset.id));

              setOpenHapus(false);
            } catch (error) {
              console.error(error);
              alert("Gagal menghapus aset. Coba lagi.");
            }
          }}
        />
      )}
    </div>
  );
}
