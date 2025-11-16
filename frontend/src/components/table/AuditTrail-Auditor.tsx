import { useEffect, useState } from "react";

export default function TableAudit({ filters }: any) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      {
        date: "2025-10-24 10:45",
        dinas: "DISKOMINFO",
        modul: "Aset",
        aksi: "Perbarui",
        detail: "Aksi INSERT pada sumber daya user_auth_devices",
      },
      {
        date: "2025-10-24 10:45",
        dinas: "DISNAKER",
        modul: "Risiko",
        aksi: "Tambah",
        detail: "Aksi UPDATE pada sumber daya permissions",
      },
      {
        date: "2025-10-24 10:45",
        dinas: "DISDUKCAPIL",
        modul: "Aset",
        aksi: "Hapus",
        detail: "Aksi DELETE pada sumber daya users",
      },
    ]);
  }, []);

  // FILTER LOGIC
  const filtered = data.filter((item) => {
    const s = filters.search.toLowerCase();

    const matchSearch =
      !filters.search ||
      item.dinas.toLowerCase().includes(s) ||
      item.modul.toLowerCase().includes(s) ||
      item.aksi.toLowerCase().includes(s) ||
      item.detail.toLowerCase().includes(s);

    const matchDate =
      filters.date.start && filters.date.end
        ? new Date(item.date) >= new Date(filters.date.start) &&
          new Date(item.date) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-gray-700 font-semibold">Aktivitas Sistem Terkini</h2>
      {/* DESKTOP TABLE */}
      <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-[#EDEDED] p-5">
        <table className="w-full min-w-[1000px] text-[14px] text-left border-collapse">
          {/* HEADER */}
          <thead className="text-[#666] border-b border-[#EDEDED]">
            <tr>
              <th className="py-4 px-2 font-semibold">Tanggal & Waktu</th>
              <th className="py-4 px-2 font-semibold">NAMA DINAS</th>
              <th className="py-4 px-2 font-semibold">MODUL</th>
              <th className="py-4 px-2 font-semibold">AKSI</th>
              <th className="py-4 px-2 font-semibold w-[320px]">DETAIL</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filtered.map((item: any, idx: number) => (
              <tr
                key={idx}
                className="border-b border-[#EDEDED] last:border-0 hover:bg-gray-50 transition"
              >
                <td className="py-5 px-2 font-medium text-gray-800 whitespace-nowrap">
                  {item.date}
                </td>

                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">
                  {item.dinas}
                </td>

                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">
                  {item.modul}
                </td>

                <td className="py-5 px-2 text-gray-700 whitespace-nowrap">
                  {item.aksi}
                </td>

                <td className="py-5 px-2 text-gray-700 leading-relaxed">
                  {item.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="xl:hidden grid grid-cols-1 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-300 bg-white rounded-xl p-4 shadow-sm"
          >
            <p className="text-gray-600 text-sm mb-1">{item.date}</p>

            <div className="text-sm text-gray-800 space-y-1">
              <p>
                <strong>Dinas:</strong> {item.dinas}
              </p>
              <p>
                <strong>Modul:</strong> {item.modul}
              </p>
              <p>
                <strong>Aksi:</strong> {item.aksi}
              </p>
              <p className="pt-1">
                <strong>Detail:</strong> <br /> {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
