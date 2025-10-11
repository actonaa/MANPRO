import { ChevronRight } from "lucide-react";

export default function PemeliharaanMendatang() {
  const jadwal = [
    { tanggal: "11 Oktober 2025", deskripsi: "Ganti Filter AC server room" },
    { tanggal: "12 Oktober 2025", deskripsi: "Patch keamanan firewall perimeter" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 w-full h-full">
      {/* Judul */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Pemeliharaan Mendatang
      </h2>

      {/* Daftar jadwal */}
      <div className="space-y-2">
        {jadwal.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3 hover:bg-blue-100 transition cursor-pointer"
          >
            {/* Kiri: Deskripsi & Tanggal */}
            <div className="flex flex-col">
              <span className="text-blue-800 font-medium text-sm sm:text-base">
                {item.deskripsi}
              </span>
              <span className="text-blue-500 text-xs sm:text-sm mt-0.5">
                {item.tanggal}
              </span>
            </div>

            {/* Kanan: Ikon panah hanya di HP */}
            <ChevronRight className="text-blue-500 w-4 h-4 block sm:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
