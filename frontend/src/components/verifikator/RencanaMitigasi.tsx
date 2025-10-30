type Mitigasi = {
  aksi: string;
  status: string;
  targetTanggal: string;
  pemilik: string;
};

type RencanaMitigasiCardProps = {
  mitigasiList?: Mitigasi[];
};

export default function RencanaMitigasi({
  mitigasiList,
}: RencanaMitigasiCardProps) {
  // 🧩 Data dummy default (kalau props kosong)
  const defaultData: Mitigasi[] = [
    {
      aksi: "Meningkatkan keamanan sistem.",
      status: "Dalam proses",
      targetTanggal: "10-10-2025",
      pemilik: "Syahroni",
    },
    {
      aksi: "Melakukan audit keamanan berkala.",
      status: "Belum diproses",
      targetTanggal: "15-11-2025",
      pemilik: "Syahroni",
    },
  ];

  const data =
    mitigasiList && mitigasiList.length > 0 ? mitigasiList : defaultData;

  // 🎨 Warna badge status
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("selesai"))
      return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("proses"))
      return "bg-blue-100 text-blue-700";
    if (status.toLowerCase().includes("belum"))
      return "bg-gray-200 text-gray-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2 md:mb-0">
          Rencana Mitigasi
        </h2>
      </div>

      {/* 💻 Tampilan Tabel untuk layar sedang ke atas */}
      <div className="hidden md:block overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="border-b border-gray-300 text-gray-700">
              <tr>
                <th className="py-4 font-bold">Aksi</th>
                <th className="py-4 font-bold">Status</th>
                <th className="py-4 font-bold">Target Tanggal</th>
                <th className="py-4 font-bold">Pemilik</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-3 text-gray-800 font-medium">{item.aksi}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-gray-800">
                    {item.targetTanggal}
                  </td>
                  <td className="py-3 font-medium text-gray-800">
                    {item.pemilik}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 italic">
            Belum ada rencana mitigasi ditambahkan.
          </p>
        )}
      </div>

      {/* 📱 Tampilan Mobile: versi kartu */}
      <div className="block md:hidden space-y-4">
        {data.length > 0 ? (
          data.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Aksi:
              </p>
              <p className="text-gray-800 mb-2">{item.aksi}</p>

              <p className="text-sm font-semibold text-gray-700 mb-1">
                Status:
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>

              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Target Tanggal:
                </p>
                <p className="text-gray-800 mb-2">{item.targetTanggal}</p>

                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Pemilik:
                </p>
                <p className="text-gray-800">{item.pemilik}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">
            Belum ada rencana mitigasi ditambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
