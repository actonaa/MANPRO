import { useMemo, useState } from "react";
import ModalDetailAktivitas from "../form/Admin/FormLaporanAuditor"; // ganti ke nama file modal kamu

type Audit = {
  id: number;
  datetime: string;
  user: string;
  dinas: string;
  role: string;
  module: string;
  action: string;
  description?: string;
  ip?: string;
};

interface Props {
  data: Audit[];
  dinas?: string;
  periode?: string;
  kategori?: string;
  status?: string;
}

export default function TabelLaporanAuditAdmin({
  data,
  dinas,
  periode,
  kategori,
  status,
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchDinas = dinas ? item.dinas === dinas : true;
      const matchPeriode = periode ? item.datetime.includes(periode) : true;
      const matchKategori = kategori ? item.module === kategori : true;
      const matchStatus = status ? item.action === status : true;
      return matchDinas && matchPeriode && matchKategori && matchStatus;
    });
  }, [data, dinas, periode, kategori, status]);

  const getActionColor = (action: string) => {
    if (action === "CREATE") return "text-green-500 font-semibold";
    if (action === "UPDATE") return "text-blue-500 font-semibold";
    if (action === "DELETE") return "text-red-500 font-semibold";
    return "text-gray-600";
  };

  return (
    <div className="mt-5 relative">
      {/* 💻 Desktop Table */}
      <div className="hidden md:block bg-white shadow-md rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse min-w-[900px]">
          <thead className="text-gray-600 bg-gray-50">
            <tr>
              <th className="py-3 px-4">TANGGAL & WAKTU</th>
              <th className="py-3 px-4">NAMA PENGGUNA</th>
              <th className="py-3 px-4">NAMA DINAS</th>
              <th className="py-3 px-4">PERAN</th>
              <th className="py-3 px-4">MODUL</th>
              <th className="py-3 px-4">AKSI</th>
              <th className="py-3 px-4">DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{item.datetime}</td>
                  <td className="py-3 px-4">{item.user}</td>
                  <td className="py-3 px-4">{item.dinas}</td>
                  <td className="py-3 px-4">{item.role}</td>
                  <td className="py-3 px-4">{item.module}</td>
                  <td className={`py-3 px-4 ${getActionColor(item.action)}`}>
                    {item.action}
                  </td>
                  <td
                    onClick={() => openModal(item)}
                    className="py-3 px-4 text-blue-500 font-medium hover:underline cursor-pointer"
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

      {/* 📱 Mobile Card */}
      <div className="md:hidden space-y-4">
        {filteredData.map((item) => (
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
        ))}
      </div>

      {/* 🔍 Modal Detail */}
      <ModalDetailAktivitas
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedData}
      />
    </div>
  );
}
