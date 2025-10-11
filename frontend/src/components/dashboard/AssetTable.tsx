interface AktivitasAssetProps {
  searchQuery?: string;
}

export default function AktivitasAsset({
  searchQuery = "",
}: AktivitasAssetProps) {
  const aktivitas = [
    {
      waktu: "10 Oktober 2025",
      jenis: "Aset",
      deskripsi: "Aset Baru: Laptop Asus Vivobook",
      status: "Terdaftar",
      warna: "bg-green-100 text-green-700",
    },
    {
      waktu: "10 Oktober 2025",
      jenis: "Risiko",
      deskripsi: "Ditemukan risiko kebocoran data",
      status: "Tinggi",
      warna: "bg-red-100 text-red-700",
    },
    {
      waktu: "10 Oktober 2025",
      jenis: "Aset",
      deskripsi: "Server #SRV12 sedang dalam perbaikan",
      status: "Dalam proses",
      warna: "bg-blue-100 text-blue-700",
    },
  ];

  // 🔍 Filter pencarian (opsional)
  const filteredAktivitas = aktivitas.filter(
    (item) =>
      item.waktu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-5 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Aktivitas Terbaru
      </h2>

      {/* 📱 Tampilan Mobile (Card Style) */}
      <div className="block lg:hidden space-y-4">
        {filteredAktivitas.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start bg-white p-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-800 leading-snug">
                {item.deskripsi}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.waktu} - {item.jenis}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${item.warna}`}
            >
              {item.status}
            </div>
          </div>
        ))}

        {filteredAktivitas.length === 0 && (
          <p className="text-center text-gray-500 py-4 italic">
            Tidak ada aktivitas yang cocok
          </p>
        )}
      </div>

      {/* 💻 Tampilan Desktop (Table Style) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
          <thead className="text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">WAKTU</th>
              <th className="px-4 py-2">JENIS AKTIVITAS</th>
              <th className="px-4 py-2">DESKRIPSI</th>
              <th className="px-4 py-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAktivitas.map((item, idx) => (
              <tr
                key={idx}
                className="bg-white hover:bg-gray-50 transition rounded-lg shadow-sm border border-gray-100"
              >
                <td className="px-4 py-3 whitespace-nowrap">{item.waktu}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.jenis}</td>
                <td className="px-4 py-3">{item.deskripsi}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.warna}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredAktivitas.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-4 italic"
                >
                  Tidak ada aktivitas yang cocok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
