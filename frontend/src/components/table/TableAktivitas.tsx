interface TableAktivitasProps {
  searchQuery?: string;
}

export default function TableAktivitas({
  searchQuery = "",
}: TableAktivitasProps) {
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
    <div className="bg-white p-5 w-full rounded-xl shadow-lg">
      <h2 className="text-[22px] font-semibold text-black mb-4">
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
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse rounded-lg">
          <thead>
            <tr className="text-left text-xs text-[#6B7280]">
              <th className="px-4 py-[20px] font-semibold text-center">
                WAKTU
              </th>
              <th className="px-4 py-[20px] font-semibold">JENIS AKTIVITAS</th>
              <th className="px-4 py-[20px] font-semibold">DESKRIPSI</th>
              <th className="px-4 py-[20px] font-semibold text-center">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAktivitas.map((item, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 text-xs font-semibold"
              >
                <td className="px-4 py-[20px] text-center">{item.waktu}</td>
                <td className="px-4 py-[20px]">{item.jenis}</td>
                <td className="px-4 py-[20px]">{item.deskripsi}</td>
                <td className="px-4 py-[20px] text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.warna}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
