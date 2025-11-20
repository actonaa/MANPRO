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
  nama: string;
  kategori: "TI" | "NON-TI";
  lokasi: string;
  kondisi: string;
  tanggal: string;
};

export default function VerifikasiAsetAdmin({
  selectedKondisi = "",
  selectedDate = null,
  selectedKategori = "",
  searchQuery = "",
}: TableProps) {
  const [data, setData] = useState<AsetItem[]>([]);
  const [openHapus, setOpenHapus] = useState(false);
  const [selectedAset, setSelectedAset] = useState<AsetItem | null>(null);

  useEffect(() => {
    setData([
      {
        id: "AST-001",
        nama: "CCTV Lobby",
        kategori: "TI",
        lokasi: "Kantor Pusat",
        kondisi: "BAIK",
        tanggal: "2025-01-12",
      },
      {
        id: "AST-002",
        nama: "Mobil Operasional",
        kategori: "NON-TI",
        lokasi: "Garasi",
        kondisi: "BAIK",
        tanggal: "2025-01-12",
      },
      {
        id: "AST-003",
        nama: "Laptop Asus Zenbook",
        kategori: "TI",
        lokasi: "Ruang Server",
        kondisi: "RUSAK - BERAT",
        tanggal: "2025-01-12",
      },
      {
        id: "AST-004",
        nama: "Meja Kantor",
        kategori: "NON-TI",
        lokasi: "Ruang Rapat",
        kondisi: "RUSAK - RINGAN",
        tanggal: "2025-01-12",
      },
      {
        id: "AST-005",
        nama: "Projector",
        kategori: "TI",
        lokasi: "Ruang Meeting",
        kondisi: "BAIK",
        tanggal: "2025-01-12",
      },
    ]);
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
    // Kondisi
    const kondisiMatch =
      !selectedKondisi ||
      item.kondisi.toLowerCase().includes(selectedKondisi.toLowerCase());

    // Tanggal
    const dateMatch =
      !selectedDate ||
      (parseDate(item.tanggal) >= parseDate(selectedDate.start) &&
        parseDate(item.tanggal) <= parseDate(selectedDate.end));

    // Kategori
    const kategoriMatch =
      !selectedKategori ||
      selectedKategori === "Kategori" ||
      item.kategori.toLowerCase() === selectedKategori.toLowerCase();

    // Search
    const searchMatch =
      !searchQuery ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    return kondisiMatch && dateMatch && kategoriMatch && searchMatch;
  });

  const getKondisiColor = (kondisi: string) => {
    if (kondisi === "BAIK") return "text-green-600";
    if (kondisi.includes("RINGAN")) return "text-orange-500";
    if (kondisi.includes("BERAT")) return "text-red-500";
    return "text-gray-600";
  };

  const handleHapus = (aset: AsetItem) => {
    setSelectedAset(aset);
    setOpenHapus(true);
  };

  // =========================== RENDER ===============================
  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* DESKTOP TABLE */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full min-w-[1100px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PENGAJUAN</th>
              <th className="py-5 px-4 font-semibold">DINAS</th>
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
                <td className="py-5 px-4">
                  {item.kategori === "TI" ? "TI" : "Non-TI"}
                </td>
                <td className="py-5 px-4">{item.lokasi}</td>

                <td
                  className={`py-5 px-4 font-semibold ${getKondisiColor(
                    item.kondisi
                  )}`}
                >
                  {item.kondisi}
                </td>

                <td className="py-5 px-4">{formatTanggal(item.tanggal)}</td>
                <td className="py-5 px-4">DISPENDIK</td>

                <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                  <Link
                    to={`/aset-verifikator/detail`}
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

      {/* MOBILE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id + item.kondisi}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <p className="text-sm text-gray-500 mb-1">
              {formatTanggal(item.tanggal)}
            </p>

            <h3 className="text-base font-semibold text-gray-800">
              {item.nama}
            </h3>

            <p className="text-sm text-gray-500 mb-2">
              {item.kategori === "TI" ? "TI" : "Non-TI"}
            </p>

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
                to={`/aset-verifikator/detail`}
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

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {openHapus && selectedAset && (
        <HapusAsetConfirm
          aset={selectedAset}
          onClose={() => setOpenHapus(false)}
          onConfirm={(aset) => {
            console.log("Aset dihapus:", aset);
            setOpenHapus(false);
          }}
        />
      )}
    </div>
  );
}
