/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

type DataItem = { label: string; value: number; color: string };

export default function StatusJadwalPemeliharaan() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // === Fetch maintenance ===
      const resMaint = await fetch(
        "https://asset-risk-management.vercel.app/api/maintenance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const maintenance = await resMaint.json();

      let sudah = 0;
      let sedang = 0;

      maintenance.forEach((item: any) => {
        if (item.completion_date) {
          sudah++; // sudah berjalan
        } else {
          sedang++; // sedang berjalan
        }
      });

      // === Fetch risks ===
      const resRisk = await fetch(
        "https://asset-risk-management.vercel.app/api/risks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const risks = await resRisk.json();

      // BELUM DIJADWALKAN = risk yang approval_status = "pending"
      const belum = risks.filter(
        (r: any) => r.approval_status === "pending"
      ).length;

      setData([
        { label: "Sudah Berjalan", value: sudah, color: "#B8F3CD" },
        { label: "Sedang Berjalan", value: sedang, color: "#3850FB" },
        { label: "Belum Dijadwalkan", value: belum, color: "#FAC7C7" },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 fetch API
  useEffect(() => {
    fetchData();
  }, []);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  // ukuran donut responsif
  const [size, setSize] = useState(200);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSize(160);
      else if (window.innerWidth < 1024) setSize(200);
      else setSize(240);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const R = size / 2 - 30;
  const STROKE = size * 0.15;
  const C = 2 * Math.PI * R;
  const cx = size / 2;
  const cy = size / 2;
  let dashOffset = 0;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full h-full flex justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Status Jadwal Pemeliharaan</h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* 🍩 Donut Chart */}
        <div className="relative mx-auto" style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {data.map((d, i) => {
              const dash = total === 0 ? 0 : (d.value / total) * C;
              const el = (
                <circle
                  key={i}
                  r={R}
                  cx={cx}
                  cy={cy}
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${C}`}
                  strokeDashoffset={-dashOffset}
                />
              );
              dashOffset += dash;
              return el;
            })}
          </svg>

          {/* Label nilai dalam lingkaran */}
          {(() => {
            let accVal = 0;
            return data.map((d, i) => {
              const start = (accVal / total) * 2 * Math.PI;
              const end = ((accVal + d.value) / total) * 2 * Math.PI;
              const mid = (start + end) / 2;
              accVal += d.value;

              const midVisual = mid - Math.PI / 2;

              const baseLabelR = R - STROKE / 2;
              const outward = STROKE * 0.8;
              const labelR = baseLabelR + outward;

              const x = cx + labelR * Math.cos(midVisual);
              const y = cy + labelR * Math.sin(midVisual);

              const p = total === 0 ? 0 : d.value / total;
              const sizeBox = Math.max(28, Math.min(60, 36 + p * 12));

              return (
                <div
                  key={i}
                  className="absolute bg-white rounded-full shadow font-semibold flex items-center justify-center"
                  style={{
                    width: sizeBox,
                    height: sizeBox,
                    fontSize: `${12 + p * 5}px`,
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {d.value}
                </div>
              );
            });
          })()}
        </div>

        {/* Legend */}
        <div className="flex flex-col space-y-3 text-sm text-center lg:text-left">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-center lg:justify-start gap-2"
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-gray-700">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
