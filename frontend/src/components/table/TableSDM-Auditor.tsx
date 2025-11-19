import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore } from "lucide-react";
import AuditorModal from "../auditor/AuditorModal"; // pastikan path sesuai

export default function TableSDM({ filters }: any) {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setData([
      {
        dinas: "DISKOMINFO",
        id: "AST - 001",
        asset: "Laptop Kerja",
        nip: "220512141116",
        name: "Budi Santoso",
        tugas: "Pengelolaan sistem server dan jaringan",
        risiko: "Kehilangan data, gangguan layanan",
        date: "2025-11-15",
      },
      {
        dinas: "DISNAKER",
        id: "AST - 002",
        asset: "Meja",
        nip: "220512141119",
        name: "Cinta Laura",
        tugas: "Pemeliharaan dan pengawasan perangkat",
        risiko: "Kesalahan pengukuran, kerusakan",
        date: "2025-11-15",
      },
      {
        dinas: "DISBUDPORA",
        id: "AST - 003",
        asset: "Komputer",
        nip: "220512141128",
        name: "Lana Del Rey",
        tugas: "Pengelolaan sistem server dan jaringan",
        risiko: "Kehilangan data, gangguan layanan",
        date: "2025-11-15",
      },
      {
        dinas: "DISDUKCAPIL",
        id: "AST - 004",
        asset: "Kendaraan Operasional",
        nip: "22051214102",
        name: "Selena Gomez",
        tugas: "Pemeliharaan dan pengawasan kendaraan",
        risiko: "Kerusakan kendaraan, kecelakaan",
        date: "2025-11-15",
      },
    ]);
  }, []);

  // OPEN POPUP
  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // SUBMIT KOMENTAR
  const handleSubmit = (comment: string) => {
    console.log("Komentar:", comment);
    console.log("Untuk SDM:", selectedItem);
    setIsModalOpen(false);
  };

  // FILTER LOGIC
  const filtered = data.filter((item) => {
    const s = filters.search.toLowerCase();

    const matchSearch =
      !filters.search ||
      item.id.toLowerCase().includes(s) ||
      item.asset.toLowerCase().includes(s) ||
      item.name.toLowerCase().includes(s);

    const matchDate =
      filters.date.start && filters.date.end
        ? new Date(item.date) >= new Date(filters.date.start) &&
          new Date(item.date) <= new Date(filters.date.end)
        : true;

    return matchSearch && matchDate;
  });

  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden xl:block bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full min-w-[1100px] text-[13px] text-center border-collapse">
          <thead className="text-gray-600">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">NIP</th>
              <th className="py-5 px-4">NAMA</th>
              <th className="py-5 px-4">TUGAS</th>
              <th className="py-5 px-4">SKENARIO RISIKO</th>
              <th className="py-5 px-4"></th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-5">{item.dinas}</td>
                <td className="py-5">{item.id}</td>
                <td className="py-5">{item.asset}</td>
                <td className="py-5">{item.nip}</td>
                <td className="py-5">{item.name}</td>
                <td className="py-5">{item.tugas}</td>
                <td className="py-5">{item.risiko}</td>

                <td className="py-5">
                  <Link
                    to="/laporan/sdm-auditor/id"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Detail
                  </Link>
                </td>

                <td className="py-5">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
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
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white relative"
          >
            <button
              onClick={() => openModal(item)}
              className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
            >
              <MessageCircleMore className="w-5 h-5 text-gray-800" />
            </button>

            <h3 className="text-base font-semibold text-gray-900">
              {item.asset}
            </h3>

            <p className="text-sm text-gray-600 mb-2">{item.id}</p>

            <div className="space-y-1 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>Dinas</span>
                <span>{item.dinas}</span>
              </p>

              <p className="flex justify-between">
                <span>NIP</span>
                <span>{item.nip}</span>
              </p>

              <p className="flex justify-between">
                <span>Nama</span>
                <span>{item.name}</span>
              </p>

              <p className="flex justify-between">
                <span>Tugas</span>
                <span className="text-right w-[55%]">{item.tugas}</span>
              </p>

              <p className="flex justify-between">
                <span>Risiko</span>
                <span className="text-right w-[55%]">{item.risiko}</span>
              </p>

              <div className="flex justify-end pt-3">
                <Link
                  to="/laporan/sdm-auditor/id"
                  className="text-blue-600 font-medium hover:underline text-sm"
                >
                  Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP AUDITOR */}
      <AuditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
