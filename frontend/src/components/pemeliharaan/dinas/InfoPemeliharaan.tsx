interface InfoProps {
  idJadwal: string;
  idAset: string;
  namaAset: string;
  kategori: string;
  lokasi: string;
  prioritas: string;
  tanggal: string;
  status: string;
}

export default function InfoPemeliharaan({
  idJadwal,
  idAset,
  namaAset,
  kategori,
  lokasi,
  prioritas,
  tanggal,
  status,
}: InfoProps) {
  // 🔹 Warna untuk prioritas
  const getPrioritasColor = (value: string) => {
    switch (value) {
      case "Tinggi":
        return "bg-red-100 text-red-700";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🔹 Warna untuk status
  const getStatusColor = (value: string) => {
    switch (value) {
      case "Mendatang":
        return "bg-blue-100 text-blue-700";
      case "Aktif":
        return "bg-green-100 text-green-700";
      case "Perbaikan":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Informasi Pemeliharaan
      </h2>

      {/* Grid: mobile = 3 kolom */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
        {/* ID Jadwal */}
        <div>
          <div className="text-gray-500 text-xs mb-1">ID Jadwal</div>
          <div className="font-medium text-gray-900">{idJadwal}</div>
        </div>

        {/* ID Asset */}
        <div>
          <div className="text-gray-500 text-xs mb-1">ID Asset</div>
          <div className="font-medium text-gray-900">{idAset}</div>
        </div>

        {/* Nama Asset */}
        <div>
          <div className="text-gray-500 text-xs mb-1">Nama Asset</div>
          <div className="font-medium text-gray-900">{namaAset}</div>
        </div>

        {/* Kategori */}
        <div>
          <div className="text-gray-500 text-xs mb-1">Kategori</div>
          <div className="font-medium text-gray-900">{kategori}</div>
        </div>

        {/* Lokasi */}
        <div>
          <div className="text-gray-500 text-xs mb-1">Lokasi</div>
          <div className="font-medium text-gray-900">{lokasi}</div>
        </div>

        {/* Prioritas */}
        <div>
          <div className="text-gray-500 text-xs mb-1">Prioritas</div>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPrioritasColor(
              prioritas
            )}`}
          >
            {prioritas}
          </span>
        </div>

        {/* Tanggal Jadwal */}
        <div>
          <div className="text-gray-500 text-xs mb-1">Tanggal Jadwal</div>
          <div className="font-medium text-gray-900">{tanggal}</div>
        </div>

        {/* Status */}
        <div>
          <div className="text-gray-500 text-xs mb-1">Status</div>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
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
