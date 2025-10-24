import { Eye, CalendarDays } from "lucide-react";

interface Props {
  selectedKategori?: string;
  selectedStatus?: string;
  selectedDate?: string; // ✅ Tambahan baru
}

export default function TableJadwalPemeliharaan({
  selectedKategori,
  selectedStatus,
  selectedDate,
}: Props) {
  const data = [
    {
      id: "AST - 001",
      nama: "Laptop Kerja",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Rendah",
      tanggal: "12 - 01 - 2025",
      status: "Aktif",
    },
    {
      id: "AST - 002",
      nama: "CCTV Lobby",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Tinggi",
      tanggal: "13 - 01 - 2025",
      status: "Perbaikan",
    },
    {
      id: "AST - 003",
      nama: "Server Ruangan IT",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Sedang",
      tanggal: "15 - 01 - 2025",
      status: "Dijadwalkan",
    },
    {
      id: "AST - 004",
      nama: "Printer Kantor",
      kategori: "Aset Non TI",
      lokasi: "Kantor Cabang",
      prioritas: "Rendah",
      tanggal: "12 - 01 - 2025",
      status: "Selesai",
    },
  ];

  // 🔧 Fungsi bantu: ubah format "12 - 01 - 2025" → "2025-01-12"
  const parseCustomDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split(" - ").map((x) => x.trim());
    return `${year}-${month}-${day}`;
  };

  // 🧩 Filter data berdasarkan kategori, status, dan tanggal
  const filteredData = data.filter((item) => {
    const matchKategori =
      !selectedKategori || item.prioritas === selectedKategori;
    const matchStatus = !selectedStatus || item.status === selectedStatus;

    // 🔍 Filter tanggal yang benar-benar cocok (bandingkan format ISO)
    const matchDate =
      !selectedDate ||
      parseCustomDate(item.tanggal) === selectedDate ||
      parseCustomDate(item.tanggal).startsWith(selectedDate); // antisipasi format

    return matchKategori && matchStatus && matchDate;
  });

  const getBadgeColor = (prioritas: string) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleViewDetail = (id: string) => {
    alert(`👁️ Melihat detail aset: ${id}`);
  };

  const handleScheduleClick = (id: string) => {
    alert(`📅 Menjadwalkan pemeliharaan aset: ${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-sm text-gray-600 border-b">
            <th className="px-6 py-3 text-left font-medium">ID ASET</th>
            <th className="px-6 py-3 text-left font-medium">NAMA ASET</th>
            <th className="px-6 py-3 text-left font-medium">KATEGORI</th>
            <th className="px-6 py-3 text-left font-medium">LOKASI</th>
            <th className="px-6 py-3 text-left font-medium">PRIORITAS</th>
            <th className="px-6 py-3 text-left font-medium">
              JADWAL PEMELIHARAAN
            </th>
            <th className="px-6 py-3 text-center font-medium">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 text-sm">
              <td className="px-6 py-3">{item.id}</td>
              <td className="px-6 py-3">{item.nama}</td>
              <td className="px-6 py-3">{item.kategori}</td>
              <td className="px-6 py-3">{item.lokasi}</td>
              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                    item.prioritas
                  )}`}
                >
                  {item.prioritas}
                </span>
              </td>
              <td className="px-6 py-3">{item.tanggal}</td>

              {/* 🔹 Kolom Aksi */}
              <td className="px-6 py-3 text-center">
                <div className="flex justify-center items-center space-x-3">
                  <button
                    onClick={() => handleViewDetail(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Lihat Detail"
                  >
                    <Eye className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>

                  <button
                    onClick={() => handleScheduleClick(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Jadwalkan"
                  >
                    <CalendarDays className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400 italic">
                Tidak ada data yang cocok
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
