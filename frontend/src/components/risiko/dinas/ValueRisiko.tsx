type ValueRisikoProps = {
  strategy?: string;
  targetDate?: string;
  costEstimation?: string | number;
  effectiveness?: string;
  probability?: number;
  impact?: number;
  residualValue?: number;
  residualLevel?: string;
};

export default function ValueRisiko({
  strategy = "-",
  targetDate = "-",
  costEstimation = "-",
  effectiveness = "-",
  probability = 0,
  impact = 0,
  residualValue = 0,
  residualLevel = "-",
}: ValueRisikoProps) {
  // 🎨 Warna teks berdasarkan level risiko residual
  const getResidualColor = (level: string) => {
    if (["Sangat Rendah", "Rendah", "Low"].includes(level))
      return "text-[#58DA28]";
    if (["Sedang", "Medium"].includes(level)) return "text-[#FFBB4D]";
    if (["Tinggi", "Sangat Tinggi", "High"].includes(level))
      return "text-[#FF2D2D]";
    return "text-gray-800";
  };

  // 💰 Format angka jadi rupiah
  const formatRupiah = (value: string | number) => {
    if (!value || value === "-") return "-";
    const num = typeof value === "string" ? parseInt(value) : value;
    if (isNaN(num)) return value;
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* 🟠 Kolom 1: Strategi & Target Waktu */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              STRATEGI
            </p>
            <p className="text-gray-800 font-bold text-base">{strategy}</p>
          </div>

          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              TARGET WAKTU
            </p>
            <p className="text-gray-800 font-bold text-base">{targetDate}</p>
          </div>
        </div>

        {/* 🟢 Kolom 2: Perkiraan Biaya & Efektivitas */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              PERKIRAAN BIAYA
            </p>
            <p className="text-gray-800 font-bold text-base">
              {formatRupiah(costEstimation)}
            </p>
          </div>

          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              EFEKTIVITAS
            </p>
            <p className="text-gray-800 font-bold text-base">
              {effectiveness}
            </p>
          </div>
        </div>

        {/* 🔴 Kolom 3: Nilai Risiko */}
        <div className="space-y-6">
          {/* ✅ Probabilitas & Dampak sejajar */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
                NILAI PROBABILITAS
              </p>
              <p className="text-red-600 font-bold text-lg">{probability}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
                NILAI DAMPAK
              </p>
              <p className="text-red-600 font-bold text-lg">{impact}</p>
            </div>
          </div>

          {/* ✅ Risiko Residual di bawahnya */}
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              NILAI RISIKO RESIDUAL
            </p>
            <p
              className={`font-bold text-lg ${getResidualColor(residualLevel)}`}
            >
              {residualValue} - {residualLevel.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
