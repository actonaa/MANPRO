import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

type TableProps = {
  selectedkondisi?: string;
  selectedStatus?: string;
  selectedDate?: { start: string; end: string } | null;
};

type AsetItem = {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  status: string;
  tanggal: string;
};

export default function TableAset({
  selectedkondisi = "",
  selectedStatus = "",
  selectedDate = null,
}: TableProps) {
  const [data, setData] = useState<AsetItem[]>([]);

  // 📊 Dummy data
  useEffect(() => {
    setData([
      {
        id: "AST-001",
        nama: "CCTV Lobby",
        kategori: "Infrastruktur",
        lokasi: "Kantor Pusat",
        kondisi: "BAIK",
        status: "Diterima",
        tanggal: "2025-01-12",
      },
      {
        id: "AST-002",
        nama: "Mobil Operasional",
        kategori: "Kendaraan",
        lokasi: "Garasi",
        kondisi: "RUSAK - RINGAN",
        status: "Tertunda",
        tanggal: "2025-02-05",
      },
      {
        id: "AST-003",
        nama: "Laptop Asus Zenbook",
        kategori: "Elektronik",
        lokasi: "Ruang Server",
        kondisi: "RUSAK - BERAT",
        status: "Ditolak",
        tanggal: "2025-03-22",
      },
    ]);
  }, []);

  // 🧮 Fungsi bantu ubah string jadi Date
  const parseDate = (dateStr: string) => new Date(dateStr);

  // ✅ Filter data berdasarkan level, status, dan tanggal
  const filteredData = data.filter((item) => {
    const levelMatch =
      !selectedkondisi ||
      item.kondisi.toLowerCase().includes(selectedkondisi.toLowerCase());
    const statusMatch =
      !selectedStatus ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();
    const dateMatch =
      !selectedDate ||
      (parseDate(item.tanggal) >= parseDate(selectedDate.start) &&
        parseDate(item.tanggal) <= parseDate(selectedDate.end));

    return levelMatch && statusMatch && dateMatch;
  });

  // 🎨 Warna kondisi
  const getKondisiColor = (kondisi: string) => {
    if (kondisi === "BAIK") return "text-green-600";
    if (kondisi.includes("RINGAN")) return "text-orange-500";
    if (kondisi.includes("BERAT")) return "text-red-500";
    return "text-gray-600";
  };

  // 🎨 Warna status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Diterima":
        return "bg-green-100 text-green-700";
      case "Tertunda":
        return "bg-yellow-100 text-yellow-700";
      case "Ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="md:pb-10 lg:bg-white lg:shadow-xl lg:p-5 lg:rounded-2xl">
      {/* 🖥️ TABEL UNTUK DESKTOP */}
      <div className="hidden lg:block">
        <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </td>
                <td className="py-5 px-4 font-medium">{item.id}</td>
                <td className="py-5 px-4">{item.nama}</td>
                <td className="py-5 px-4">{item.kategori}</td>
                <td className="py-5 px-4">{item.lokasi}</td>
                <td className={`py-5 px-4 font-semibold ${getKondisiColor(item.kondisi)}`}>
                  {item.kondisi}
                </td>
                <td className="py-5 px-4">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-5 px-4 text-gray-500 flex justify-center">
                  <button className="hover:text-blue-600" title="Lihat Detail">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD UNTUK MOBILE/TABLET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </p>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                  item.status
                )}`}
              >
                {item.status}
              </span>
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
                <span className="font-medium text-gray-700">Kategori:</span>{" "}
                {item.kategori}
              </p>
            </div>

            <div className="flex justify-end mt-4 text-gray-500">
              <button className="hover:text-blue-600" title="Lihat Detail">
                <Eye size={18} />
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
    </div>
  );
}
