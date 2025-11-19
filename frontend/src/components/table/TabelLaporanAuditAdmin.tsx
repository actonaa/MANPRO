import { useMemo, useState } from "react";
import ModalDetailAktivitas from "../form/Admin/FormLaporanAuditor";

type Audit = {
  id: number;
  datetime: string;
  user: string;
  dinas: string;
  role: string;
  module: string;
  action: string;
};

interface Props {
  data: Audit[];
  search?: string;
  dinas?: string;
  periode?: string; // format: 2025-10-01_2025-10-10
  kategori?: string; // role
  status?: string; // module
}

export default function TabelLaporanAuditAdmin({
  data,
  search = "",
  dinas = "",
  periode = "",
  kategori = "",
  status = "",
}: Props) {
  const [selectedData, setSelectedData] = useState<Audit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: Audit) => {
    setSelectedData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedData(null);
    setIsModalOpen(false);
  };

  // ===============================
  // 🔥 FILTER LOGIC
  // ===============================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1️⃣ SEARCH
      const matchSearch = search
        ? item.user.toLowerCase().includes(search.toLowerCase()) ||
          item.dinas.toLowerCase().includes(search.toLowerCase()) ||
          item.role.toLowerCase().includes(search.toLowerCase()) ||
          item.module.toLowerCase().includes(search.toLowerCase()) ||
          item.action.toLowerCase().includes(search.toLowerCase())
        : true;

      // 2️⃣ DINAS
      const matchDinas = dinas ? item.dinas === dinas : true;

      // 3️⃣ PERIODE (range)
      let matchPeriode = true;
      if (periode.includes("_")) {
        const [start, end] = periode.split("_");

        if (start && end) {
          const tanggalItem = item.datetime.split(" - ")[0]; // "10/24/2025"
          const [mm, dd, yyyy] = tanggalItem.split("/");

          const dateItem = new Date(`${yyyy}-${mm}-${dd}`);
          const dateStart = new Date(start);
          const dateEnd = new Date(end);

          matchPeriode = dateItem >= dateStart && dateItem <= dateEnd;
        }
      }

      // 4️⃣ PERAN
      const matchKategori = kategori ? item.role === kategori : true;

      // 5️⃣ MODUL
      const matchStatus = status ? item.module === status : true;

      return (
        matchSearch &&
        matchDinas &&
        matchPeriode &&
        matchKategori &&
        matchStatus
      );
    });
  }, [data, search, dinas, periode, kategori, status]);

  const getActionColor = (action: string) => {
    if (action === "CREATE") return "text-green-500 font-semibold";
    if (action === "UPDATE") return "text-blue-500 font-semibold";
    if (action === "DELETE") return "text-red-500 font-semibold";
    return "text-gray-600";
  };

  return (
    <div className="mt-5 relative">
      {/* 💻 Desktop */}
      <div className="hidden md:block bg-white shadow-md rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse min-w-[900px]">
          <thead className="bg-white text-gray-700 text-[15px]">
            <tr className="border-b border-gray-300">
              <th className="py-4 px-4 font-semibold">TANGGAL & WAKTU</th>
              <th className="py-4 px-4 font-semibold">NAMA PENGGUNA</th>
              <th className="py-4 px-4 font-semibold">NAMA DINAS</th>
              <th className="py-4 px-4 font-semibold">PERAN</th>
              <th className="py-4 px-4 font-semibold">MODUL</th>
              <th className="py-4 px-4 font-semibold">AKSI</th>
              <th className="py-4 px-4 font-semibold">DETAIL</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition"
                >
                  <td className="py-4 px-4 text-[15px] text-gray-700">
                    {item.datetime}
                  </td>
                  <td className="py-4 px-4 text-[15px] text-gray-700">
                    {item.user}
                  </td>
                  <td className="py-4 px-4 text-[15px] text-gray-700">
                    {item.dinas}
                  </td>
                  <td className="py-4 px-4 text-[15px] text-gray-700">
                    {item.role}
                  </td>
                  <td className="py-4 px-4 text-[15px] text-gray-700">
                    {item.module}
                  </td>
                  <td
                    className={`py-4 px-4 text-[15px] ${getActionColor(
                      item.action
                    )}`}
                  >
                    {item.action}
                  </td>

                  <td
                    onClick={() => openModal(item)}
                    className="py-4 px-4 text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    Lihat
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-gray-500 italic">
                  Tidak ada data yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile */}
      <div className="md:hidden space-y-4">
        {filteredData.length ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-gray-500">{item.datetime}</p>
                <button
                  onClick={() => openModal(item)}
                  className="text-blue-500 text-xs font-medium hover:underline"
                >
                  Lihat
                </button>
              </div>

              <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">
                {item.user}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dinas</span>
                  <span className="text-gray-700">{item.dinas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peran</span>
                  <span className="text-gray-700">{item.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Modul</span>
                  <span className="text-gray-700">{item.module}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Aksi</span>
                  <span className={getActionColor(item.action)}>
                    {item.action}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data ditemukan.
          </p>
        )}
      </div>

      {/* Modal */}
      <ModalDetailAktivitas
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedData}
      />
    </div>
  );
}
