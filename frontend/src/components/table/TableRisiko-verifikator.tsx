import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";

type TableRisikoProps = {
  searchTerm?: string;
  selectedStatus?: string;
  selectedKategori?: string;
};

type RisikoItem = {
  id: string;
  title: string;
  type: string;
  criteria: string;
  priority: string;
  status: string;
  entry_level: number;
  asset: { name: string; lokasi: string };
  department: { name: string };
};

export default function TableRisiko({
  searchTerm = "",
  selectedStatus = "",
  selectedKategori = "",
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);

  // 📊 Dummy data langsung di sini
  useEffect(() => {
    setData([
      {
        id: "RISK-001",
        title: "Gangguan Jaringan",
        type: "Teknis",
        criteria: "Tinggi",
        priority: "Infrastruktur",
        status: "Diterima",
        entry_level: 25,
        asset: { name: "Server Utama", lokasi: "Data Center" },
        department: { name: "IT" },
      },
      {
        id: "RISK-002",
        title: "Kehilangan Data",
        type: "Operasional",
        criteria: "Sedang",
        priority: "IT",
        status: "Tertunda",
        entry_level: 18,
        asset: { name: "Database", lokasi: "Server Room" },
        department: { name: "IT" },
      },
      {
        id: "RISK-003",
        title: "Kerusakan Perangkat",
        type: "Fisik",
        criteria: "Rendah",
        priority: "Perangkat",
        status: "Ditolak",
        entry_level: 10,
        asset: { name: "CCTV Lobby", lokasi: "Lobi Utama" },
        department: { name: "Maintenance" },
      },
    ]);
  }, []);

  // ✅ Filter data sesuai pencarian, status, dan level
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus
      ? item.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    const matchesKategori = selectedKategori
      ? item.criteria.toLowerCase() === selectedKategori.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesKategori;
  });

  return (
    <div className="overflow-x-auto md:pb-10">
      <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
        <thead className="text-[#666666] border-b border-[#ddd]">
          <tr>
            <th className="py-5 px-4 font-semibold">ID RISIKO</th>
            <th className="py-5 px-4 font-semibold">NAMA ASET</th>
            <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
            <th className="py-5 px-4 font-semibold">TIPE</th>
            <th className="py-5 px-4 font-semibold">LEVEL</th>
            <th className="py-5 px-4 font-semibold">STATUS</th>
            <th className="py-5 px-4 font-semibold">KATEGORI</th>
            <th className="py-5 px-4 font-semibold">SKOR</th>
            <th className="py-5 px-4 font-semibold">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr
              key={item.id}
              className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
            >
              <td className="py-5 px-4 font-semibold">{item.id}</td>
              <td className="py-5 px-4">{item.asset.name}</td>
              <td className="py-5 px-4">{item.title}</td>
              <td className="py-5 px-4">{item.type}</td>

              {/* Warna level */}
              <td
                className={`py-5 px-4 font-semibold ${
                  item.criteria === "Tinggi"
                    ? "text-red-500"
                    : item.criteria === "Sedang"
                    ? "text-orange-500"
                    : "text-green-500"
                }`}
              >
                {item.criteria}
              </td>

              {/* Badge status */}
              <td className="py-5 px-4">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-medium ${
                    item.status === "Diterima"
                      ? "bg-green-100 text-green-600"
                      : item.status === "Tertunda"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="py-5 px-4">{item.priority}</td>
              <td className="py-5 px-4">{item.entry_level}</td>

              {/* 🛠️ Tombol Aksi */}
              <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                <button className="hover:text-blue-600" title="Lihat Detail">
                  <Eye size={18} />
                </button>
                <button className="hover:text-green-600" title="Setujui Risiko">
                  <CheckCircle size={18} />
                </button>
                <button className="hover:text-red-600" title="Tolak Risiko">
                  <XCircle size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok.
        </p>
      )}
    </div>
  );
}
