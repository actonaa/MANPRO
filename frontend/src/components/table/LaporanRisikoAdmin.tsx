// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useMemo, useState } from "react";
import ExportModal from "../../components/dropdown/Export";
import { Upload } from "lucide-react";

type Risiko = {
  id: string;
  namaAset: string;
  namaRisiko: string;
  level: string;
  skor: number;
  kategori: string;
  status: string;
  date: string;
  dinas?: string;
};

const data: Risiko[] = [
  {
    id: "RISK - 001",
    namaAset: "Laptop Kerja",
    namaRisiko: "Kebocoran data",
    level: "Tinggi",
    skor: 20,
    kategori: "IT",
    status: "Aktif",
    date: "2025-01-12",
    dinas: "Diskominfo",
  },
  {
    id: "RISK - 002",
    namaAset: "CCTV Lobby",
    namaRisiko: "Gangguan Keamanan",
    level: "Sedang",
    skor: 12,
    kategori: "IT",
    status: "Perbaikan",
    date: "2025-01-15",
    dinas: "Dinas Pendidikan",
  },
  {
    id: "RISK - 003",
    namaAset: "Meja",
    namaRisiko: "Permukaan Rusak",
    level: "Rendah",
    skor: 6,
    kategori: "NON-IT",
    status: "Tidak Aktif",
    date: "2025-01-12",
    dinas: "Pariwisata",
  },
];

const getLevelColor = (level: string) => {
  if (level === "Tinggi") return "text-red-500 font-semibold";
  if (level === "Sedang") return "text-orange-500 font-semibold";
  if (level === "Rendah") return "text-green-500 font-semibold";
  return "text-gray-600";
};

const getStatusStyle = (status: string) => {
  if (status === "Aktif")
    return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium";
  if (status === "Perbaikan")
    return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium";
  if (status === "Tidak Aktif")
    return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium";
  return "text-gray-600";
};

export default function RisikoTableSection({
  search,
  dinas,
  period,
  level,
  status,
}: any) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);

      // SEARCH
      const matchSearch = search
        ? item.namaAset.toLowerCase().includes(search.toLowerCase()) ||
          item.namaRisiko.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase())
        : true;

      // DINAS — FIX LOWERCASE MATCH
      const matchDinas = dinas
        ? item.dinas?.toLowerCase() === dinas.toLowerCase()
        : true;

      // PERIODE RANGE
      const matchPeriod = period
        ? itemDate >= new Date(period.start) && itemDate <= new Date(period.end)
        : true;

      // LEVEL — FIX CASE SENSITIVE ISSUE
      const matchLevel = level
        ? item.level.toLowerCase() === level.toLowerCase()
        : true;

      // STATUS — FIX CASE SENSITIVE ISSUE
      const matchStatus = status
        ? item.status.toLowerCase() === status.toLowerCase()
        : true;

      return (
        matchSearch && matchDinas && matchPeriod && matchLevel && matchStatus
      );
    });
  }, [search, dinas, period, level, status]);

  return (
    <div className="rounded-2xl p-2 border border-gray-100">
      {/* 📱 EXPORT MOBILE */}
      <div className="md:hidden mb-3">
        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm text-gray-700 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden md:block rounded-xl bg-white">
        <div className="flex mb-3 p-4">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="min-w-[1000px] w-full text-sm text-center text-gray-600">
            <thead>
              <tr>
                <th className="py-5 px-4 font-semibold">ID RISIKO</th>
                <th className="py-5 px-4 font-semibold">NAMA ASET</th>
                <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
                <th className="py-5 px-4 font-semibold">LEVEL</th>
                <th className="py-5 px-4 font-semibold">SKOR</th>
                <th className="py-5 px-4 font-semibold">KATEGORI</th>
                <th className="py-5 px-4 font-semibold">STATUS</th>
                <th className="py-5 px-4 font-semibold">DINAS</th>
                <th className="py-5 px-4 font-semibold"></th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-5 px-4 font-semibold">{item.id}</td>
                    <td className="py-5 px-4">{item.namaAset}</td>
                    <td className="py-5 px-4">{item.namaRisiko}</td>
                    <td className={`py-5 px-4 ${getLevelColor(item.level)}`}>
                      {item.level}
                    </td>
                    <td className="py-5 px-4">{item.skor}</td>
                    <td className="py-5 px-4">{item.kategori}</td>
                    <td className="py-5 px-4">
                      <span className={getStatusStyle(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-5 px-4">{item.dinas}</td>

                    <td className="py-5 px-4">
                      <a
                        href={`/risiko/${item.id}`}
                        className="text-blue-500 font-medium hover:underline"
                      >
                        Detail
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-4 text-gray-400 italic"
                  >
                    Tidak ada data yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📱 CARD */}
      <div className="md:hidden space-y-4 mt-2">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredData.map((item, i) => (
              <div
                key={i}
                className="border bg-white border-gray-200 rounded-xl shadow-sm p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500 font-medium">{item.id}</p>
                  <a
                    href={`/risiko/${item.id}`}
                    className="text-[#0095E8] text-sm font-medium hover:underline"
                  >
                    Detail
                  </a>
                </div>

                <h3 className="font-semibold border-b pb-2 text-gray-800 text-[15px] mb-3">
                  {item.namaAset}
                </h3>

                <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Risiko:</span>{" "}
                    {item.namaRisiko}
                  </p>
                  <p className="text-right">
                    <span className="font-medium">Level:</span>{" "}
                    <span className={getLevelColor(item.level)}>
                      {item.level}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium">Skor:</span> {item.skor}
                  </p>
                  <p className="text-right">
                    <span className="font-medium">Kategori:</span>{" "}
                    {item.kategori}
                  </p>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Dinas:</span> {item.dinas}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className={getStatusStyle(item.status)}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.date.split("-").reverse().join("-")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data yang sesuai dengan filter.
          </p>
        )}
      </div>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </div>
  );
}
