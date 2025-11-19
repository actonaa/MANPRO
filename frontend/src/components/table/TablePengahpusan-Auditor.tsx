import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore } from "lucide-react";

export default function TablePenghapusan({ filters }: any) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      {
        dinas: "DISKOMINFO",
        id: "AST-001",
        name: "Asus Zenbook",
        reason: "Terlalu usang dan tidak kompatibel",
        value: "Rp21.500.000",
        date_delete: "2025-11-15",
      },
      {
        dinas: "DISKOMINFO",
        id: "AST-002",
        name: "Printer Kantor",
        reason: "Sering rusak, biaya perbaikan tinggi",
        value: "Rp21.500.000",
        date_delete: "2025-11-15",
      },
      {
        dinas: "DISKOMINFO",
        id: "AST-003",
        name: "Kendaraan Operasional",
        reason: "Kecelakaan berat, tidak layak pakai",
        value: "Rp21.500.000",
        date_delete: "2025-11-15",
      },
      {
        dinas: "DISKOMINFO",
        id: "AST-004",
        name: "Printer Kantor",
        reason: "Sering rusak, biaya perbaikan tinggi",
        value: "Rp21.500.000",
        date_delete: "2025-11-15",
      },
    ]);
  }, []);

  // FILTER
  const filteredData = data.filter((item) => {
    const s = filters.search.toLowerCase();

    const matchSearch =
      filters.search === "" ||
      item.id.toLowerCase().includes(s) ||
      item.name.toLowerCase().includes(s);

    const matchDate =
      filters.date.start && filters.date.end
        ? new Date(item.date_delete) >= new Date(filters.date.start) &&
          new Date(item.date_delete) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  return (
    <div>
      {/* DESKTOP TABLE */}
      <div className="hidden xl:block bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">ALASAN</th>
              <th className="py-5 px-4">NILAI ASET</th>
              <th className="py-5 px-4">TGL PENGHAPUSAN</th>
              <th className="py-5 px-4"></th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-5">{item.dinas}</td>
                <td className="py-5">{item.id}</td>
                <td className="py-5">{item.name}</td>
                <td className="py-5">{item.reason}</td>
                <td className="py-5">{item.value}</td>
                <td className="py-5">{item.date_delete}</td>

                <td className="py-5">
                  <Link
                    to="/penghapusan/detail"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden mt-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white relative"
          >
            <button className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full">
              <MessageCircleMore className="w-5 h-5 text-gray-800" />
            </button>

            <h3 className="text-base font-semibold text-gray-900">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.id}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex justify-between">
                <span>Dinas</span>
                <span>{item.dinas}</span>
              </p>

              <p className="flex justify-between">
                <span>Alasan</span>
                <span className="text-right w-[55%]">{item.reason}</span>
              </p>

              <p className="flex justify-between">
                <span>Nilai</span>
                <span>{item.value}</span>
              </p>

              <p className="flex justify-between">
                <span>Tgl Hapus</span>
                <span>{item.date_delete}</span>
              </p>

              <div className="flex justify-end pt-3">
                <Link
                  to="/penghapusan/detail"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
