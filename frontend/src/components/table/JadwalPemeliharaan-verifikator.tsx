import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import PopupJadwalPemeliharaan from "../../components/form/verifikator/JadwalPemeliharaan";

type TablePemeliharaanProps = {
  selectedLevel?: string;
  selectedStatus?: string; // ⬅ WAJIB TAMBAH
  selectedDate?: { start: string; end: string } | null;
};

type PemeliharaanItem = {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  prioritas: string;
  tanggal: string;
};

export default function TablePemeliharaanVerifikator({
  selectedLevel = "",
  selectedDate = null,
  selectedStatus = "",
}: TablePemeliharaanProps) {
  const [data, setData] = useState<PemeliharaanItem[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedAset, setSelectedAset] = useState<PemeliharaanItem | null>(
    null
  );

  useEffect(() => {
    setData([
      {
        id: "AST-001",
        nama: "Laptop Kerja",
        kategori: "Aset TI",
        lokasi: "Kantor Pusat",
        prioritas: "Rendah",
        tanggal: "2025-01-12",
      },
      {
        id: "AST-002",
        nama: "CCTV Lobby",
        kategori: "Aset TI",
        lokasi: "Kantor Pusat",
        prioritas: "Tinggi",
        tanggal: "2025-01-13",
      },
      {
        id: "AST-003",
        nama: "Server Ruangan IT",
        kategori: "Aset TI",
        lokasi: "Kantor Pusat",
        prioritas: "Sedang",
        tanggal: "2025-01-15",
      },
      {
        id: "AST-004",
        nama: "Printer Kantor",
        kategori: "Aset Non TI",
        lokasi: "Kantor Cabang",
        prioritas: "Rendah",
        tanggal: "2025-01-12",
      },
    ]);
  }, []);

  const filteredData = data.filter((item) => {
    const matchLevel = selectedLevel
      ? item.prioritas.toLowerCase() === selectedLevel.toLowerCase()
      : true;
    const matchesStatus = selectedStatus
      ? item.kategori?.toLowerCase() === selectedStatus.toLowerCase()
      : true;
    const matchDate = selectedDate
      ? item.tanggal >= selectedDate.start && item.tanggal <= selectedDate.end
      : true;
    return matchLevel && matchesStatus && matchDate;
  });

  const getBadgeColor = (prioritas: string) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleJadwalkan = (item: PemeliharaanItem) => {
    setSelectedAset(item);
    setOpenPopup(true);
  };

  const handleSubmitJadwal = (tanggal: string) => {
    if (!selectedAset) return;
    setData((prev) =>
      prev.map((x) => (x.id === selectedAset.id ? { ...x, tanggal } : x))
    );
  };

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 lg:rounded-2xl relative">
      {/* 🖥️ Tabel Desktop */}
      <div className="hidden xl:block">
        <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">PRIORITAS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.nama}</td>
                <td className="py-5 px-4">{item.kategori}</td>
                <td className="py-5 px-4">{item.lokasi}</td>
                <td className="py-5 px-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                      item.prioritas
                    )}`}
                  >
                    {item.prioritas}
                  </span>
                </td>
                <td className="py-5 px-4 text-gray-600">{item.tanggal}</td>

                {/* ICON TUNGGAL */}
                <td className="py-5 px-4">
                  <div className="flex items-center justify-center min-w-[60px]">
                    <button
                      className="hover:text-green-600"
                      title="Jadwalkan Pemeliharaan"
                      onClick={() => handleJadwalkan(item)}
                    >
                      <CalendarDays size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Card Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">{item.tanggal}</p>

            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.nama}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.lokasi}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Prioritas:</span>{" "}
                <span className={getBadgeColor(item.prioritas)}>
                  {item.prioritas}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Kategori:</span>{" "}
                {item.kategori}
              </p>
              <p>
                <span className="font-medium text-gray-700">Tanggal:</span>{" "}
                {item.tanggal}
              </p>
            </div>

            {/* ICON TUNGGAL MOBILE */}
            <div className="flex justify-end gap-3 mt-4 text-gray-500">
              <button
                className="hover:text-green-600"
                title="Jadwalkan Pemeliharaan"
                onClick={() => handleJadwalkan(item)}
              >
                <CalendarDays size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {/* Popup Jadwal */}
      <PopupJadwalPemeliharaan
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleSubmitJadwal}
      />
    </div>
  );
}
