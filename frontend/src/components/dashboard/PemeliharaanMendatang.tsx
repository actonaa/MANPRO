export default function PemeliharaanMendatang() {
  const jadwal = [
    { tanggal: "11 Oktober 2025", deskripsi: "Ganti Filter AC server room" },
    {
      tanggal: "12 Oktober 2025",
      deskripsi: "Patch keamanan firewall perimeter",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 w-full h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Pemeliharaan Mendatang
      </h2>

      <div className="space-y-3">
        {jadwal.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3 text-sm font-medium text-gray-800 hover:bg-blue-100 transition"
          >
            <span>{item.tanggal}</span>
            <span>{item.deskripsi}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
