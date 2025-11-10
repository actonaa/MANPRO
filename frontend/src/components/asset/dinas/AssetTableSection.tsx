import { useMemo } from "react";

type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  status: string;
  date: string;
  dinas?: string;
};

const data: Asset[] = [
  {
    id: "AST - 001",
    name: "CCTV Lobby",
    category: "Infrastruktur",
    location: "Kantor Pusat",
    condition: "BAIK",
    status: "Aktif",
    date: "12 - 01 - 2025",
  },
  {
    id: "AST - 002",
    name: "Mobil Operasional",
    category: "Kendaraan",
    location: "Garasi",
    condition: "BAIK",
    status: "Perbaikan",
    date: "15 - 01 - 2025",
  },
  {
    id: "AST - 003",
    name: "Laptop Asus Zenbook",
    category: "Elektronik",
    location: "Ruang Server",
    condition: "RUSAK - BERAT",
    status: "Tidak Aktif",
    date: "12 - 01 - 2025",
  },
];

const getConditionColor = (condition: string) => {
  if (condition === "BAIK") return "text-green-600 font-semibold";
  if (condition.includes("RINGAN")) return "text-yellow-600 font-semibold";
  if (condition.includes("BERAT")) return "text-red-600 font-semibold";
  return "text-gray-600";
};

const getStatusStyle = (status: string) => {
  if (status === "Aktif")
    return "bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium";
  if (status === "Perbaikan")
    return "bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium";
  if (status === "Tidak Aktif")
    return "bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium";
  return "text-gray-600";
};

interface Props {
  dinas?: string;
  period?: string;
  condition?: string;
  status?: string;
}

export default function AssetTableSection({
  dinas,
  period,
  condition,
  status,
}: Props) {
  // ✅ Filter berdasarkan dropdown
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const formattedDate = item.date.split(" - ").reverse().join("-");
      const matchDinas = dinas ? item.dinas === dinas : true; // ✅ Tambah 1 baris filter dinas
      const matchPeriod = period ? formattedDate === period : true;
      const matchCondition = condition ? item.condition === condition : true;
      const matchStatus = status ? item.status === status : true;
      return matchDinas && matchPeriod && matchCondition && matchStatus; // ✅ tambahkan matchDinas di sini
    });
  }, [dinas, period, condition, status]);

  return (
    <div className="mt-5">
      {/* 💻 TABEL (Desktop) */}
      <div className="overflow-x-auto hidden md:block bg-white rounded-2xl">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">TANGGA PEROLEHAn</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
                >
                  <td className="py-5 px-4 text-[#333]">{item.id}</td>
                  <td className="py-5 px-4 text-[#666]">{item.name}</td>
                  <td className="py-5 px-4 text-[#666]">{item.category}</td>
                  <td className="py-5 px-4 text-[#666]">{item.location}</td>
                  <td
                    className={`py-5 px-4 ${getConditionColor(item.condition)}`}
                  >
                    {item.condition}
                  </td>
                  <td className="py-5 px-4">
                    <span className={getStatusStyle(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#666]">{item.date}</td>
                  <td className="py-5 px-4">
                    <a
                      href={`/aset/${item.id}`}
                      className="text-[#0095E8] font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-5 text-gray-500 italic"
                >
                  Tidak ada data yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD (Mobile) */}
      <div className="md:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm p-4"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500">{item.id}</p>
                <a
                  href={`/aset/${item.id}`}
                  className="text-[#0095E8] text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>

              <h3 className="font-semibold border-b pb-2 border-gray-300 text-gray-800 text-[15px] mb-3">
                {item.name}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-700">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="text-gray-700">{item.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kondisi</span>
                  <span className={getConditionColor(item.condition)}>
                    {item.condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={getStatusStyle(item.status)}>
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="text-gray-700">{item.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data yang sesuai dengan filter.
          </p>
        )}
      </div>
    </div>
  );
}
