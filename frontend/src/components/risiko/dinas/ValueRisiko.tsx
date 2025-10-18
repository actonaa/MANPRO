export default function ValueRisiko() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* 🟠 Kolom 1: Strategi & Target Waktu */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              STRATEGI
            </p>
            <p className="text-gray-800 font-bold text-base">Reduce</p>
          </div>

          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              TARGET WAKTU
            </p>
            <p className="text-gray-800 font-bold text-base">10-15-2025</p>
          </div>
        </div>

        {/* 🟢 Kolom 2: Perkiraan Biaya & Efektivitas */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              PERKIRAAN BIAYA
            </p>
            <p className="text-gray-800 font-bold text-base">Rp. 1.000.000</p>
          </div>

          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              EFEKTIVITAS
            </p>
            <p className="text-gray-800 font-bold text-base">TINGGI</p>
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
              <p className="text-red-600 font-bold text-lg">4</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
                NILAI DAMPAK
              </p>
              <p className="text-red-600 font-bold text-lg">3</p>
            </div>
          </div>

          {/* ✅ Risiko Residual di bawahnya */}
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-1">
              NILAI RISIKO RESIDUAL
            </p>
            <p className="text-red-600 font-bold text-lg">20 - SEDANG TINGGI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
