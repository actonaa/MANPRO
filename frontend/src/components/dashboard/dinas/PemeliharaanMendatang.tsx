import { ChevronRight } from "lucide-react";

export default function PemeliharaanMendatang() {
  const jadwal = [
    { tanggal: "11 Oktober 2025", deskripsi: "Ganti Filter AC server room" },
    {
      tanggal: "12 Oktober 2025",
      deskripsi: "Patch keamanan firewall perimeter",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
      {/* Judul */}
      <h2 className="text-lg lg:text-[22px] font-semibold text-black mb-4">
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
            <div className="flex flex-col md:flex-row-reverse md:justify-around md:p-4 md:gap-20">
              <p className="text-blue-800 md:text-black font-medium md:font-semibold text-sm">
                {item.deskripsi}
              </p>
              <p className="text-blue-500 md:text-black text-xs mt-0.5 md:mt-0 md:font-semibold md:text-sm">
                {item.tanggal}
              </p>
            </div>

            {/* Kanan: Ikon panah hanya di HP */}
            <ChevronRight className="text-blue-500 w-4 h-4 block md:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
