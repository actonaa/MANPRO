interface DetailJadwalProps {
  idJadwal: string;
  idAset: string;
  namaAset: string;
  kategori: string;
  lokasi: string;
  prioritas: "Rendah" | "Sedang" | "Tinggi";
  tanggalJadwal: string;
  status: "Mendatang" | "Sedang Dikerjakan" | "Selesai";
}

export default function DetailJadwalCard({
  idJadwal,
  idAset,
  namaAset,
  kategori,
  lokasi,
  prioritas,
  tanggalJadwal,
  status,
}: DetailJadwalProps) {
  // 🎨 Warna otomatis untuk Prioritas
  const getPrioritasColor = (prioritas: string) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-100 text-red-700";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // 🎨 Warna otomatis untuk Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Mendatang":
        return "bg-blue-100 text-blue-700";
      case "Sedang Dikerjakan":
        return "bg-yellow-100 text-yellow-700";
      case "Selesai":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-base font-semibold mb-4">
        Detail Jadwal Pemeliharaan
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 text-sm text-gray-700">
        <div>
          <p className="text-gray-500 text-xs">ID Jadwal</p>
          <p className="font-semibold">{idJadwal}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">ID Aset</p>
          <p className="font-semibold">{idAset}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Nama Aset</p>
          <p className="font-semibold">{namaAset}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Kategori</p>
          <p className="font-semibold">{kategori}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Lokasi</p>
          <p className="font-semibold">{lokasi}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Prioritas</p>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPrioritasColor(
              prioritas
            )}`}
          >
            {prioritas}
          </span>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Tanggal Jadwal</p>
          <p className="font-semibold">{tanggalJadwal}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Status</p>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
