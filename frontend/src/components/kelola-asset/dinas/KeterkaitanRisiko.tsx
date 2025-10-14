import React from "react";

interface RisikoItem {
  kode: string;
  deskripsi: string;
  dampak: "Sangat Rendah" | "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";
}

interface KeterkaitanRisikoProps {
  risiko: RisikoItem[];
}

const getRiskColor = (dampak: RisikoItem["dampak"]) => {
  switch (dampak) {
    case "Sangat Rendah":
      return "bg-green-100 border border-green-200 text-green-800";
    case "Rendah":
      return "bg-green-200 border border-green-300 text-green-900";
    case "Sedang":
      return "bg-yellow-50 border border-yellow-200 text-yellow-900";
    case "Tinggi":
      return "bg-red-100 border border-red-200 text-red-800";
    case "Sangat Tinggi":
      return "bg-red-200 border border-red-300 text-red-900";
    default:
      return "bg-gray-100 border border-gray-200";
  }
};

const KeterkaitanRisiko: React.FC<KeterkaitanRisikoProps> = ({ risiko }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Keterkaitan Risiko</h2>

      <ul className="space-y-3">
        {risiko.map((r, index) => (
          <li
            key={index}
            className={`px-4 py-3 rounded-xl ${getRiskColor(
              r.dampak
            )} transition`}
          >
            <p className="font-medium">
              {r.kode} — {r.deskripsi} (Dampak: {r.dampak})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeterkaitanRisiko;
