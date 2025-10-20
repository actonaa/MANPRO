interface Props {
  selectedKategori?: string;
  selectedStatus?: string;
}

export default function TableJadwalPemeliharaan({
  selectedKategori,
  selectedStatus,
}: Props) {
  const data = [
    {
      id: "AST - 001",
      nama: "Laptop Kerja",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Rendah",
      tanggal: "12 - 01 - 2025",
      status: "Aktif",
    },
    {
      id: "AST - 002",
      nama: "CCTV Lobby",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Tinggi",
      tanggal: "12 - 01 - 2025",
      status: "Perbaikan",
    },
    {
      id: "AST - 002",
      nama: "CCTV Lobby",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Sedang",
      tanggal: "12 - 01 - 2025",
      status: "Perbaikan",
    },
    {
      id: "AST - 002",
      nama: "CCTV Lobby",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Rendah",
      tanggal: "12 - 01 - 2025",
      status: "Perbaikan",
    },
  ];

  // Filter data berdasarkan kategori dan status
  const filteredData = data.filter(
    (item) =>
      (!selectedKategori || item.kategori === selectedKategori) &&
      (!selectedStatus || item.status === selectedStatus)
  );

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

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-sm text-gray-600 border-b border-gray-200">
              <th className="px-6 py-3 text-left font-medium">ID ASET</th>
              <th className="px-6 py-3 text-left font-medium">NAMA ASET</th>
              <th className="px-6 py-3 text-left font-medium">KATEGORI</th>
              <th className="px-6 py-3 text-left font-medium">LOKASI</th>
              <th className="px-6 py-3 text-left font-medium">PRIORITAS</th>
              <th className="px-6 py-3 text-left font-medium">
                JADWAL PEMELIHARAAN
              </th>
              <th className="px-6 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                <td className="px-6 py-3">{item.id}</td>
                <td className="px-6 py-3">{item.nama}</td>
                <td className="px-6 py-3">{item.kategori}</td>
                <td className="px-6 py-3">{item.lokasi}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                      item.prioritas
                    )}`}
                  >
                    {item.prioritas}
                  </span>
                </td>
                <td className="px-6 py-3">{item.tanggal}</td>
                <td className="px-6 py-3 text-blue-500 font-medium cursor-pointer">
                  Detail
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
