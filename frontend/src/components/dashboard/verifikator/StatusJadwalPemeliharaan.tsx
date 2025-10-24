import { useEffect, useState } from "react";

type DataItem = { label: string; value: number; color: string };

export default function StatusJadwalPemeliharaan() {
  const data: DataItem[] = [
    { label: "Sudah Disetujui", value: 20, color: "#B8F3CD" },
    { label: "Sedang Berjalan", value: 50, color: "#3850FB" },
    { label: "Belum Dijadwalkan", value: 10, color: "#FAC7C7" },
  ];

  const total = data.reduce((acc, d) => acc + d.value, 0);

  // 📏 Ukuran donut responsif
  const [size, setSize] = useState(200);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSize(160); // 📱 Mobile
      else if (window.innerWidth < 1024) setSize(200); // 💻 Tablet
      else setSize(240); // 🖥️ Desktop
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const R = size / 2 - 30; // radius luar donut dinamis
  const STROKE = size * 0.15; // tebal donut proporsional
  const C = 2 * Math.PI * R;
  const cx = size / 2;
  const cy = size / 2;
  let dashOffset = 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Status Jadwal Pemeliharaan</h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* 🍩 Donut */}
        <div
          className="relative mx-auto"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <svg viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {data.map((d, i) => {
              const dash = (d.value / total) * C;
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
                  strokeLinecap="butt"
                />
              );
              dashOffset += dash;
              return el;
            })}
          </svg>

          {/* ⚪ Label: keluar dari tengah warna */}
          {(() => {
            let accVal = 0;

            return data.map((d, i) => {
              const start = (accVal / total) * 2 * Math.PI;
              const end = ((accVal + d.value) / total) * 2 * Math.PI;
              const mid = (start + end) / 2;
              accVal += d.value;

              // 📍 sudut tengah segmen
              const midVisual = mid - Math.PI / 2;

              // 🪄 keluar lebih jauh dari tengah donut
              const baseLabelR = R - STROKE / 2;
              const outward = STROKE * 0.8; // <== ✨ nilai ini bikin keluar (semakin besar semakin keluar)
              const labelR = baseLabelR + outward;

              const x = cx + labelR * Math.cos(midVisual);
              const y = cy + labelR * Math.sin(midVisual);

              // ukuran bulat & font proporsional
              const p = d.value / total;
              const labelSize = Math.max(28, Math.min(60, 36 + p * 12));

              return (
                <div
                  key={i}
                  className="absolute bg-white rounded-full shadow font-semibold flex items-center justify-center transition-all"
                  style={{
                    width: `${labelSize}px`,
                    height: `${labelSize}px`,
                    fontSize: `${12 + p * 5}px`,
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {d.value}
                </div>
              );
            });
          })()}
        </div>

        {/* 📋 Legend */}
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
