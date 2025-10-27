import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

type LaporanRiskVerifProps = {
  selectedStatus?: string;
  selectedLevel?: string;
  selectedDate?: { start: string; end: string } | null;
};

type RisikoItem = {
  id: string;
  date: string;
  title: string;
  criteria: string;
  category: string;
  status: string;
  entry_level: number;
  asset: { name: string; lokasi: string };
  department: { name: string };
};

export default function LaporanRiskVerif({
  selectedStatus = "",
  selectedLevel = "",
  selectedDate = null,
}: LaporanRiskVerifProps) {
  const [data, setData] = useState<RisikoItem[]>([]);

  // 📊 Dummy data
  useEffect(() => {
    setData([
      {
        id: "RISK-001",
        date: "2025-10-10",
        title: "Gangguan Jaringan",
        criteria: "Tinggi",
        category: "IT",
        status: "Diterima",
        entry_level: 25,
        asset: { name: "Server Utama", lokasi: "Data Center" },
        department: { name: "IT" },
      },
      {
        id: "RISK-002",
        date: "2025-10-20",
        title: "Kehilangan Data",
        criteria: "Sedang",
        category: "IT",
        status: "Tertunda",
        entry_level: 18,
        asset: { name: "Database", lokasi: "Server Room" },
        department: { name: "IT" },
      },
      {
        id: "RISK-003",
        date: "2025-09-25",
        title: "Kerusakan Perangkat",
        criteria: "Rendah",
        category: "NON-IT",
        status: "Ditolak",
        entry_level: 10,
        asset: { name: "CCTV Lobby", lokasi: "Lobi Utama" },
        department: { name: "Maintenance" },
      },
    ]);
  }, []);

  // ✅ Filter data sesuai filter aktif
  const filteredData = data.filter((item) => {
    const matchesStatus = selectedStatus
      ? item.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    const matchesLevel = selectedLevel
      ? item.criteria.toLowerCase() === selectedLevel.toLowerCase()
      : true;

    const matchesDate = selectedDate
      ? item.date >= selectedDate.start && item.date <= selectedDate.end
      : true;

    return matchesStatus && matchesLevel && matchesDate;
  });

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* 🖥️ Tabel untuk layar besar */}
      <div className="hidden xl:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4 ">{item.date}</td>
                <td className="py-5 px-4 ">{item.id}</td>
                <td className="py-5 px-4">{item.asset.name}</td>
                <td className="py-5 px-4">{item.title}</td>
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
                <td className="py-5 px-4">{item.category}</td>
                <td className="py-5 px-4">{item.entry_level}</td>
                <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                  <button className="hover:text-blue-600" title="Lihat Detail">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Card layout untuk mobile dan tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">{item.date}</p>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.status === "Diterima"
                    ? "bg-green-100 text-green-600"
                    : item.status === "Tertunda"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.asset.name}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Level:</span>{" "}
                <span
                  className={`${
                    item.criteria === "Tinggi"
                      ? "text-red-500"
                      : item.criteria === "Sedang"
                      ? "text-orange-500"
                      : "text-green-500"
                  } font-semibold`}
                >
                  {item.criteria}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Kategori:</span>{" "}
                {item.category}
              </p>
              <p>
                <span className="font-medium text-gray-700">Skor:</span>{" "}
                {item.entry_level}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4 text-gray-500">
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
