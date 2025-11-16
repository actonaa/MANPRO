import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore } from "lucide-react";

type Filters = {
  search: string;
  date: { start: string; end: string };
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

export default function LaporanRiskVerif({ filters }: { filters: Filters }) {
  const [data, setData] = useState<RisikoItem[]>([]);

  useEffect(() => {
    setData([
      {
        id: "RISK-001",
        date: "2025-10-10",
        title: "Kebocoran data",
        criteria: "Tinggi",
        category: "TI",
        status: "Diterima",
        entry_level: 20,
        asset: { name: "Laptop Kerja", lokasi: "Kantor Pusat" },
        department: { name: "DISKOMINFO" },
      },
      {
        id: "RISK-002",
        date: "2025-10-20",
        title: "Gangguan Keamanan",
        criteria: "Sedang",
        category: "TI",
        status: "Tertunda",
        entry_level: 12,
        asset: { name: "CCTV Lobby", lokasi: "Lobby" },
        department: { name: "DISKOMINFO" },
      },
      {
        id: "RISK-003",
        date: "2025-09-22",
        title: "Permukaan Rusak",
        criteria: "Rendah",
        category: "NON-TI",
        status: "Ditolak",
        entry_level: 6,
        asset: { name: "Meja", lokasi: "Ruang Rapat" },
        department: { name: "DISKOMINFO" },
      },
    ]);
  }, []);

  const filteredData = data.filter((item) => {
    const { search, date } = filters;

    const matchSearch = search
      ? item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.asset.name.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchDate =
      date.start && date.end
        ? new Date(item.date) >= new Date(date.start) &&
          new Date(item.date) <= new Date(date.end)
        : true;

    return matchSearch && matchDate;
  });

  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID RISIKO</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">NAMA RISIKO</th>
              <th className="py-5 px-4">LEVEL</th>
              <th className="py-5 px-4">SKOR</th>
              <th className="py-5 px-4">KATEGORI</th>
              <th className="py-5 px-4">STATUS</th>
              <th className="py-5 px-4"></th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#e5e5e5] hover:bg-gray-50"
              >
                <td className="py-5">{item.department.name}</td>
                <td className="py-5">{item.id}</td>
                <td className="py-5">{item.asset.name}</td>
                <td className="py-5">{item.title}</td>

                <td
                  className={`py-5 font-semibold ${
                    item.criteria === "Tinggi"
                      ? "text-red-500"
                      : item.criteria === "Sedang"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {item.criteria}
                </td>

                <td className="py-5">{item.entry_level}</td>
                <td className="py-5">{item.category}</td>

                <td className="py-5">
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

                <td className="py-5">
                  <Link
                    to="/risiko-auditor/detail"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Detail
                  </Link>
                </td>

                <td className="py-5">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MessageCircleMore className="w-5 h-5 text-gray-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {filteredData.map((item) => (
          <div className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white relative">
            <button className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full">
              <MessageCircleMore className="w-5 h-5 text-gray-800" />
            </button>

            <p className="text-sm text-gray-500 mb-1">{item.date}</p>

            <h3 className="text-base font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.asset.name}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex justify-between">
                <span>ID Risiko</span>
                <span>{item.id}</span>
              </p>

              <p className="flex justify-between">
                <span>Level</span>
                <span
                  className={
                    item.criteria === "Tinggi"
                      ? "text-red-500 font-semibold"
                      : item.criteria === "Sedang"
                      ? "text-orange-500 font-semibold"
                      : "text-green-500 font-semibold"
                  }
                >
                  {item.criteria}
                </span>
              </p>

              <p className="flex justify-between">
                <span>Kategori</span>
                <span>{item.category}</span>
              </p>

              <p className="flex justify-between">
                <span>Skor</span>
                <span>{item.entry_level}</span>
              </p>

              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/risiko-auditor/detail"
                  className="text-blue-600 font-medium hover:underline text-sm"
                >
                  Detail
                </Link>

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
