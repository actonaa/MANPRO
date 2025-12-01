import React from "react";

interface ApiRiskItem {
  id: string;
  title: string;
  description: string;
  criteria: "Low" | "Medium" | "High" | null;
}

interface KeterkaitanRisikoProps {
  risiko: ApiRiskItem[];
  approvalStatus: string;
  assetId: string;
}

const getRiskColor = (criteria: string | null) => {
  switch (criteria) {
    case "Low":
      return "border-yellow-300 bg-yellow-50";
    case "Medium":
      return "border-yellow-400 bg-yellow-100";
    case "High":
      return "border-red-300 bg-red-50";
    default:
      return "border-gray-300 bg-gray-100";
  }
};

const translateCriteria = (criteria: string | null) => {
  if (criteria === "Low") return "Rendah";
  if (criteria === "Medium") return "Sedang";
  if (criteria === "High") return "Tinggi";
  return "-";
};

const KeterkaitanRisiko: React.FC<KeterkaitanRisikoProps> = ({
  risiko,
  approvalStatus,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
      <h2 className="font-semibold text-lg mb-4">Keterkaitan Risiko</h2>

      {approvalStatus !== "pending" && risiko.length === 0 && (
        <p className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-300 mb-5">
          Tidak ada risiko terkait aset ini.
        </p>
      )}

      <ul className="space-y-3">
        {risiko.map((r) => {
          const kode = r.id;
          return (
            <li
              key={r.id}
              className={`flex justify-between items-center px-4 py-3 rounded-lg border ${getRiskColor(
                r.criteria
              )}`}
            >
              <p className="text-sm font-medium">
                {kode} — {r.title}{" "}
                <span className="text-gray-700 font-normal">
                  (Dampak: {translateCriteria(r.criteria)})
                </span>
              </p>

              <a
                href={`/laporan/risiko-auditor/${r.id}`}
                className="text-[#007BFF] text-sm font-medium hover:underline whitespace-nowrap"
              >
                Detail Risiko
              </a>
            </li>
          );
        })}

        {approvalStatus === "pending" && (
          <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded border border-yellow-300">
            Menunggu persetujuan verifikator
          </p>
        )}
      </ul>
    </div>
  );
};

export default KeterkaitanRisiko;
