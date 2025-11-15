import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

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
};

export default function TableAset({
  selectedkondisi = "",
  selectedDate = null,
}: TableProps) {
  const [data, setData] = useState<AsetItem[]>([]);

  // Dummy data
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

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* Desktop Table */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
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
                <td className={`py-5 px-4 font-semibold ${getKondisiColor(item.kondisi)}`}>
                  {item.kondisi}
                </td>
                <td className="py-5 px-4">{formatTanggal(item.tanggal)}</td>
                <td className="py-5 px-4 text-gray-500 flex justify-center">
                  <a
                    href={`/aset-verifikator/detail`}
                    className="hover:text-blue-600"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id + item.kondisi}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">{formatTanggal(item.tanggal)}</p>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-1">{item.nama}</h3>
            <p className="text-sm text-gray-500 mb-3">{item.kategori}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Kondisi:</span>{" "}
                <span className={`${getKondisiColor(item.kondisi)} font-semibold`}>
                  {item.kondisi}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Lokasi:</span> {item.lokasi}
              </p>
              <p>
                <span className="font-medium text-gray-700">Kategori:</span> {item.kategori}
              </p>
            </div>

            <div className="flex justify-end mt-4 text-gray-500">
              <a
                href={`/aset-verifikator/detail`}
                className="hover:text-blue-600"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">Tidak ada data yang cocok dengan filter.</p>
      )}
    </div>
  );
}
