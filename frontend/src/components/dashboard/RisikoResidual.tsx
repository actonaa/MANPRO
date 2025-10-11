export default function RisikoResidual() {
  const risiko = 30; // 📊 hardcode risiko residual

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col lg:flex-col justify-between w-full h-full gap-6">
      {/* Judul */}
      <div className="flex flex-col lg:items-start lg:text-left">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Risiko Residual
        </h2>
      </div>

      <div className="flex md:gap-6">
        {/* 📊 Semi gauge sederhana */}
        <div className="relative w-38 h-24 ">
          <svg viewBox="0 0 100 50" className="w-full h-full -ml-3">
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
              stroke="#16a34a"
              strokeWidth="10"
              strokeDasharray={`${(risiko / 100) * 125} 200`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-end mb-2 -ml-5">
            <span className="text-xl font-bold text-gray-800">{risiko}%</span>
            <span className="text-green-600 text-sm font-medium ">Rendah</span>
          </div>
        </div>

        {/* 📊 Legend */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            Risiko Rendah – 60%
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            Risiko Sedang – 30%
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Risiko Tinggi – 10%
          </div>
        </div>
      </div>
    </div>
  );
}
