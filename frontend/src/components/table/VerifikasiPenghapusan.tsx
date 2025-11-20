import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import SetujuPenghapusan from "../../components/form/verifikator/setujuPenghapusan";
import TolakPenghapusan from "../../components/form/verifikator/TolakPenghapusan";

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

export default function VerifikasiPenghapusan({
  selectedkondisi = "",
  selectedDate = null,
}: TableProps) {
  const [data, setData] = useState<AsetItem[]>([]);
  const [openSetuju, setOpenSetuju] = useState(false);
  const [openTolak, setOpenTolak] = useState(false);
  const [selectedAset, setSelectedAset] = useState<AsetItem | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // ambil token

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

        // Filter hanya yang pending
        const pendingAssets = res.data.filter(
          (item) => item.approval_status === "pending_delete"
        );

        const mappedData: AsetItem[] = pendingAssets.map((item) => ({
          id: item.id,
          nama: item.name || "-",
          kategori: item.sub_category?.name || item.category?.name || "-",
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
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} - ${month} - ${year}`;
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
        {/* Skeleton Desktop Table */}
        <div className="hidden xl:block overflow-x-auto animate-pulse">
          <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
            <tbody>
              {Array.from({ length: 5 }).map((_, row) => (
                <tr key={row} className="border-b border-b-[#ddd]">
                  {Array.from({ length: 8 }).map((_, col) => (
                    <td key={col} className="py-5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-full">
                        &nbsp;
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton Mobile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2">&nbsp;</div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2">&nbsp;</div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2">&nbsp;</div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="h-4 bg-gray-200 rounded w-full">&nbsp;</div>
                <div className="h-4 bg-gray-200 rounded w-full">&nbsp;</div>
                <div className="h-4 bg-gray-200 rounded w-full">&nbsp;</div>
                <div className="h-4 bg-gray-200 rounded w-full">&nbsp;</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* DESKTOP TABLE */}
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
              <th className="py-5 px-4 font-semibold">TANGGAL PENGAJUAN</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id + item.kondisi}
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
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => handleSetuju(item)}
                    className="hover:text-green-600"
                    title="Setujui Aset"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleTolak(item)}
                    className="hover:text-red-600"
                    title="Tolak Aset"
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
        {filteredData.map((item) => (
          <div
            key={item.id + item.kondisi}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                {formatTanggal(item.tanggal)}
              </p>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.nama}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.kategori}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Kondisi:</span>{" "}
                <span
                  className={`${getKondisiColor(item.kondisi)} font-semibold`}
                >
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
                title="Lihat Detail"
              >
                <Eye size={18} />
              </Link>

              <button
                onClick={() => handleSetuju(item)}
                className="hover:text-green-600"
                title="Setujui Aset"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleTolak(item)}
                className="hover:text-red-600"
                title="Tolak Aset"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {openSetuju && selectedAset && (
        <SetujuPenghapusan
          aset={selectedAset}
          onClose={() => setOpenSetuju(false)}
        />
      )}

      {openTolak && selectedAset && (
        <TolakPenghapusan
          aset={selectedAset}
          onClose={() => setOpenTolak(false)}
        />
      )}
    </div>
  );
}
