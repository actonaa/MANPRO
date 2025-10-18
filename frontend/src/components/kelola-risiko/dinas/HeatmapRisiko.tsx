import React from "react";

interface HeatmapProps {
  data: number[][];
}

const probabilities = [
  "Hampir pasti",
  "Kemungkinan besar",
  "Kemungkinan sedang",
  "Kemungkinan kecil",
  "Jarang",
];

const impacts = [
  "Sangat rendah",
  "Rendah",
  "Sedang",
  "Tinggi",
  "Sangat tinggi",
];

// ✅ Warna sesuai kategori risiko (background + font)
const getCellColor = (value: number) => {
  if (value <= 2) return "bg-[#C6FFC5] text-[#368734]"; // sangat rendah
  if (value <= 4) return "bg-[#6EE26C] text-[#368734]"; // rendah
  if (value <= 6) return "bg-[#FFF784] text-[#8E8616]"; // sedang (rendah)
  if (value <= 8) return "bg-[#FFDB3A] text-[#8E8616]"; // sedang (tinggi)
  if (value <= 12) return "bg-[#FFDB3A] text-[#8E8616]"; // tinggi sedang
  if (value <= 15) return "bg-[#FFA0A0] text-[#860101]"; // tinggi
  if (value <= 20) return "bg-[#FFA0A0] text-[#860101]"; // tinggi
  return "bg-[#FF2D2D] text-[#860101]"; // sangat tinggi parah
};

const HeatmapRisiko: React.FC<HeatmapProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 w-full h-full max-w-6xl mx-auto overflow-x-auto">
      <h2 className="text-xl font-semibold text-center mb-8 text-gray-800">
        Heatmap Risiko (Probabilitas × Dampak)
      </h2>

      <div className="flex items-stretch">
        {/* 📍 Label vertikal "Probabilitas" di tengah */}
        <div className="flex items-center mr-4">
          <div className="text-[18px] font-semibold text-gray-400 rotate-[-90deg] whitespace-nowrap">
            Probabilitas
          </div>
        </div>

        {/* 📊 Grid utama */}
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-[200px_repeat(5,1fr)] gap-2 w-full">
            {/* Kolom kiri: probabilitas */}
            <div className="flex flex-col space-y-2 justify-between">
              {probabilities.map((p, idx) => (
                <div
                  key={idx}
                  className="h-14 flex items-center justify-center rounded-lg bg-gray-50 text-gray-700 font-medium border border-gray-200 shadow-sm text-sm sm:text-base"
                >
                  {p}
                </div>
              ))}
            </div>
            {/* Grid risiko */}
            <div className="col-span-5 grid grid-cols-5 gap-2">
              {data.flat().map((value, idx) => (
                <div
                  key={idx}
                  className={`h-14 flex items-center justify-center text-base sm:text-lg font-semibold rounded-lg shadow-sm border border-gray-200 ${getCellColor(
                    value
                  )}`}
                >
                  {value}
                </div>
              ))}
            </div>
            {/* Label dampak sejajar otomatis */}
            <div></div> {/* ✅ Spacer untuk kolom kiri */}
            {impacts.map((impact, idx) => (
              <div
                key={idx}
                className="text-center text-gray-700 font-semibold bg-gray-50 rounded-lg py-2 border border-gray-200 shadow-sm text-sm sm:text-base"
              >
                {impact}
              </div>
            ))}
          </div>

          {/* 📍 Label "Dampak" di tengah horizontal */}
          <div className="mt-6 flex justify-center">
            <div className="text-lg font-semibold text-gray-400">Dampak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapRisiko;
