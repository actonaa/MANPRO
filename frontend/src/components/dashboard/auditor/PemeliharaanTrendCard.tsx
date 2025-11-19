export default function PemeliharaanTrendCard() {
  // ✅ Data dummy untuk 12 bulan
  const data = [
    { month: "Jan", aset: 5 },
    { month: "Feb", aset: 14 },
    { month: "Mar", aset: 8 },
    { month: "Apr", aset: 12 },
    { month: "May", aset: 20 },
    { month: "Jun", aset: 11 },
    { month: "Jul", aset: 25 },
    { month: "Aug", aset: 18 },
    { month: "Sep", aset: 22 },
    { month: "Oct", aset: 17 },
    { month: "Nov", aset: 26 },
    { month: "Dec", aset: 30 },
  ];

  // Skala dinamis
  const maxY = Math.max(...data.map((d) => d.aset));
  const paddingX = 50;
  const paddingY = 30;
  const width = 700;
  const height = 300;

  // Titik-titik garis
  const points = data
    .map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2); // posisi horizontal
      const y = height - paddingY - (d.aset / maxY) * (height - paddingY * 2); // posisi vertikal
      return `${x},${y}`;
    })
    .join(" ");

  // Label Y
  const ySteps = 5;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((maxY / ySteps) * i)
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full h-full">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
        Tren Pemeliharaan{" "}
        <span className="block text-gray-500 text-sm">
          (Total Aset yang Dipelihara per-Bulan)
        </span>
      </h2>

      {/* Legenda */}
      <div className="flex justify-center items-center gap-2 mt-4 mb-5 text-gray-700">
        <span className="w-4 h-4 bg-[#B197FF] rounded-full opacity-70"></span>
        <span className="text-sm">Data Aset</span>
      </div>

      {/* Grafik */}
      <div className="relative w-full h-72 border border-gray-200 rounded-lg bg-gradient-to-b from-white to-gray-50 overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Garis bantu horizontal */}
          {yLabels.map((label, i) => {
            const y =
              height - paddingY - (label / maxY) * (height - paddingY * 2);
            return (
              <g key={`y-${i}`}>
                <line
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text x={10} y={y + 4} fontSize="10" fill="#6B7280">
                  {label}
                </text>
              </g>
            );
          })}

          {/* Garis bantu vertikal tiap bulan */}
          {data.map((_, i) => {
            const x =
              paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
            return (
              <line
                key={`x-${i}`}
                x1={x}
                x2={x}
                y1={paddingY}
                y2={height - paddingY}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          })}

          {/* Garis data */}
          <polyline
            fill="none"
            stroke="#B197FF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Titik data */}
          {points.split(" ").map((p, i) => {
            const [x, y] = p.split(",");
            return <circle key={i} cx={x} cy={y} r="6" fill="#B197FF" />;
          })}
        </svg>

        {/* Label bulan */}
        <div className="absolute bottom-2 w-full flex justify-between text-xs text-gray-500 px-10">
          {data.map((d) => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
