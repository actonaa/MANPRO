// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useMemo, useState } from "react";
import ExportModal from "../../components/dropdown/Export";

type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  status: string;
  date: string;
  dinas: string;
};

const data: Asset[] = [
  {
    id: "AST - 001",
    name: "CCTV Lobby",
    category: "TI",
    location: "Kantor Pusat",
    condition: "BAIK",
    status: "Aktif",
    date: "12 - 01 - 2025",
    dinas: "Dinas Pariwisata",
  },
  {
    id: "AST - 002",
    name: "Mobil Operasional",
    category: "NON-TI",
    location: "Garasi",
    condition: "BAIK",
    status: "Aktif",
    date: "12 - 01 - 2025",
    dinas: "DISHUB",
  },
  {
    id: "AST - 002",
    name: "Mobil Operasional",
    category: "NON-TI",
    location: "Garasi",
    condition: "RUSAK - RINGAN",
    status: "Tidak Aktif",
    date: "12 - 01 - 2025",
    dinas: "DISHUB",
  },
  {
    id: "AST - 002",
    name: "Mobil Operasional",
    category: "NON-TI",
    location: "Garasi",
    condition: "RUSAK - BERAT",
    status: "Tidak Aktif",
    date: "12 - 01 - 2025",
    dinas: "DISHUB",
  },
  {
    id: "AST - 003",
    name: "Laptop Asus Zenbook",
    category: "TI",
    location: "Ruang Server",
    condition: "RUSAK - BERAT",
    status: "Tidak Aktif",
    date: "12 - 01 - 2025",
    dinas: "DISHUB",
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
  search?: string;
}

export default function AssetTableSection({
  dinas,
  period,
  condition,
  status,
  search,
}: Props) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const formattedDate = item.date.split(" - ").reverse().join("-");

      const matchSearch = search
        ? item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchDinas = dinas
        ? item.dinas?.toLowerCase() === dinas.toLowerCase()
        : true;
      const matchPeriod = period ? formattedDate === period : true;
      const matchCondition = condition
        ? item.condition.toLowerCase() === condition
        : true;
      const matchStatus = status ? item.status.toLowerCase() === status : true;

      return (
        matchSearch &&
        matchDinas &&
        matchPeriod &&
        matchCondition &&
        matchStatus
      );
    });
  }, [search, dinas, period, condition, status]);

  return (
    <div className="mt-5">
      {/* 💻 DESKTOP TABLE */}
      <div className="overflow-x-auto hidden lg:block bg-white rounded-2xl">
        {/* 🔵 BUTTON EXPORT (OPEN POPUP) */}
        <div className="flex justify-start mb-3 p-4">
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-[#0095E8] text-white rounded-lg text-sm font-medium hover:bg-[#007ACC] transition"
          >
            Export
          </button>
        </div>

        <table className="w-full min-w-[900px] text-[14px] text-gray-700 text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">KONDISI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
              <th className="py-5 px-4 font-semibold">DINAS</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-5 px-4">{item.id}</td>
                  <td className="py-5 px-4">{item.name}</td>
                  <td className="py-5 px-4">{item.category}</td>
                  <td className="py-5 px-4">{item.location}</td>
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
                  <td className="py-5 px-4">{item.date}</td>
                  <td className="py-5 px-4">{item.dinas}</td>
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
                <td colSpan={9} className="py-5 text-gray-500 italic">
                  Tidak ada data yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE / TABLET CARD VIEW */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="border bg-white border-gray-200 rounded-xl shadow-sm p-4"
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

              <div className="text-[14px] text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span>{item.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi</span>
                  <span>{item.location}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Dinas</span>
                  <span>{item.dinas}</span>
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
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 italic">
            Tidak ada data yang sesuai dengan filter.
          </p>
        )}
      </div>

      {/* 🔵 EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </div>
  );
}
