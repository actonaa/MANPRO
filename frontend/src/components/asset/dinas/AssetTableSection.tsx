import { Eye } from "lucide-react";

type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  status: string;
  date: string;
};

const data: Asset[] = [
  {
    id: "AST - 001",
    name: "CCTV Lobby",
    category: "Infrastruktur",
    location: "Kantor Pusat",
    condition: "BAIK",
    status: "Diterima",
    date: "12 - 01 - 2025",
  },
  {
    id: "AST - 002",
    name: "Mobil Operasional",
    category: "Kendaraan",
    location: "Garasi",
    condition: "BAIK",
    status: "Tertunda",
    date: "15 - 01 - 2025",
  },
  {
    id: "AST - 003",
    name: "Laptop Asus Zenbook",
    category: "Elektronik",
    location: "Ruang Server",
    condition: "RUSAK - BERAT",
    status: "Ditolak",
    date: "12 - 01 - 2025",
  },
];

const getConditionColor = (condition: string) => {
  if (condition === "BAIK") return "text-green-500 font-semibold";
  if (condition.includes("RINGAN")) return "text-orange-500 font-semibold";
  if (condition.includes("BERAT")) return "text-red-500 font-semibold";
  return "text-[#666666]";
};

const getStatusStyle = (status: string) => {
  if (status === "Diterima")
    return "bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium";
  if (status === "Tertunda")
    return "bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium";
  if (status === "Ditolak")
    return "bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium";
  return "text-[#666666]";
};

export default function AssetTableSection({
  period,
  condition,
  status,
}: {
  period: string;
  condition: string;
  status: string;
}) {
  // ✅ Filter berdasarkan dropdown
  const filteredData = data.filter((item) => {
    // 🔄 Ubah format tanggal "12 - 01 - 2025" → "2025-01-12"
    const formattedDate = item.date.split(" - ").reverse().join("-");

    const matchPeriod = period ? formattedDate === period : true;
    const matchCondition = condition ? item.condition === condition : true;
    const matchStatus = status ? item.status === status : true;

    return matchPeriod && matchCondition && matchStatus;
  });

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-[#666666]">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-4 font-semibold">ID ASET</th>
              <th className="py-3 px-4 font-semibold">NAMA ASET</th>
              <th className="py-3 px-4 font-semibold">KATEGORI</th>
              <th className="py-3 px-4 font-semibold">LOKASI</th>
              <th className="py-3 px-4 font-semibold">KONDISI</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold">TANGGAL</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-semibold">{item.id}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4">{item.location}</td>
                <td
                  className={`py-3 px-4 ${getConditionColor(item.condition)}`}
                >
                  {item.condition}
                </td>
                <td className="py-3 px-4">
                  <span className={getStatusStyle(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4 text-center">
                  <Eye size={18} className="text-[#666666] cursor-pointer" />
                </td>
              </tr>
            ))}

            {/* ✅ Jika tidak ada hasil */}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  Tidak ada data yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
