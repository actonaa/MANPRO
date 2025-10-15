import React from "react";

interface RisikoResidualProps {
  rendah: number;
  sedang: number;
  tinggi: number;
}

const RisikoResidual: React.FC<RisikoResidualProps> = ({
  rendah,
  sedang,
  tinggi,
}) => {
  // ✅ Gunakan nilai langsung dari props
  let kategori = "Rendah";
  let warna = "text-green-600";
  let warnaGauge = "#16a34a";
  let nilaiTertinggi = rendah;

  if (sedang > rendah && sedang > tinggi) {
    kategori = "Sedang";
    warna = "text-orange-500";
    warnaGauge = "#f97316";
    nilaiTertinggi = sedang;
  } else if (tinggi > rendah && tinggi > sedang) {
    kategori = "Tinggi";
    warna = "text-red-500";
    warnaGauge = "#dc2626";
    nilaiTertinggi = tinggi;
  }

  // 📊 Hitung panjang gauge (opsional hanya untuk visual)
  const strokeLength = (nilaiTertinggi / (rendah + sedang + tinggi)) * 125;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between w-full h-full gap-6">
      {/* 🔹 Judul */}
      <div className="flex flex-col lg:items-start lg:text-left">
        <h2 className="text-lg font-semibold text-[#131313] mb-4 lg:ml-12 lg:text-[22px] lg:mb-0">
          Risiko {kategori}
        </h2>
      </div>

      <div className="flex md:justify-between flex-col md:flex-row items-center md:items-start">
        {/* 📊 Gauge */}
        <div className="relative w-40 h-24 lg:w-60 lg:h-40 mb-6 md:mb-0">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path
              d="M10 50 A40 40 0 0 1 90 50"
              fill="none"
              stroke="#BBF7D0"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M10 50 A40 40 0 0 1 90 50"
              fill="none"
              stroke={warnaGauge}
              strokeWidth="10"
              strokeDasharray={`${strokeLength} 200`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-end mb-2">
            <span className="text-2xl md:text-3xl lg:text-[32px] font-bold text-gray-800">
              {nilaiTertinggi}
            </span>
            <span className={`text-sm md:text-base font-medium ${warna}`}>
              {kategori}
            </span>
          </div>
        </div>

        {/* 📊 Legend */}
        <div className="flex flex-col gap-3 text-sm md:text-base text-[12px] w-fit">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            Risiko Rendah – {rendah}
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            Risiko Sedang – {sedang}
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Risiko Tinggi – {tinggi}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RisikoResidual;
