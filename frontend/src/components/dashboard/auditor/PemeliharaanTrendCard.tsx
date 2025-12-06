import { useEffect, useState } from "react";

interface Maintenance {
  scheduled_date: string | null;
  asset: {
    department: {
      name: string;
    };
  };
}

export default function PemeliharaanTrendCard() {
  const [data, setData] = useState<{ month: string; aset: number }[]>([]);
  const [loading, setLoading] = useState(true); // state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();

        const scheduled = json.filter(
          (item: Maintenance) => item.scheduled_date !== null
        );

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const counts = Array(12).fill(0);
        scheduled.forEach((item: Maintenance) => {
          const date = new Date(item.scheduled_date!);
          counts[date.getMonth()] += 1;
        });

        const chartData = counts.map((count, idx) => ({
          month: monthNames[idx],
          aset: count,
        }));

        setData(chartData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // selesai loading
      }
    };

    fetchData();
  }, []);

  // Skala dinamis
  const maxY = data.length ? Math.max(...data.map((d) => d.aset)) : 1;
  const paddingX = 50;
  const paddingY = 30;
  const width = 700;
  const height = 300;

  const points = data
    .map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (d.aset / maxY) * (height - paddingY * 2);
      return `${x},${y}`;
    })
    .join(" ");

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

      {/* Spinner saat loading */}
      {loading ? (
        <div className="flex justify-center items-center h-72">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
