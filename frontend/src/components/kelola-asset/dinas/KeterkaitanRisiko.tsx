import React from "react";
import ButtonImg from "../../button/ButtonImg";

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
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="font-semibold text-lg mb-4">Keterkaitan Risiko</h2>

      <ul className="space-y-3">
        {risiko.map((r, index) => (
          <li
            key={index}
            className={`px-5 py-3 rounded-lg ${getRiskColor(
              r.dampak
            )} flex items-center justify-between transition`}
          >
            {/* Kiri: Deskripsi Risiko */}
            <div>
              <p className="font-medium text-sm">
                {r.kode} — {r.deskripsi}
              </p>
              <p className="text-sm">Dampak: {r.dampak}</p>
            </div>

            {/* Kanan: Tombol Detail */}
            <a
              href={`/detail-risiko/${r.kode}`}
              className="text-[#007BFF] font-medium text-sm hover:underline"
            >
              Detail Risiko
            </a>
          </li>
        ))}

        {/* Tombol Tambah Aset */}
        <a href="/risiko/tambah">
          <ButtonImg
            title="Tambah Risiko"
            img="/kelola-asset/tambah-asset.png"
            color="#00a9ff"
            hoverColor="#a0e9ff"
            borderColor="#00a9ff"
            textColor="white"
            px="2"
            fontWeight="font-medium"
            wFull="w-full"
            paddingY="py-3"
          />
        </a>
      </ul>
    </div>
  );
};

export default KeterkaitanRisiko;
