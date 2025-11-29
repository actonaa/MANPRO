import { useEffect, useState } from "react";
import axios from "axios";

type Criteria = "Low" | "Medium" | "High";
type ApprovalStatus = "approved" | "rejected" | "pending";

interface RiskItem {
  id: string;
  criteria: Criteria;
  approval_status: ApprovalStatus;
}

export default function RisikoResidual() {
  const [lowPercent, setLowPercent] = useState(0);
  const [mediumPercent, setMediumPercent] = useState(0);
  const [highPercent, setHighPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskResidual = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<RiskItem[]>(
          "https://asset-risk-management.vercel.app/api/risks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ambil risk approved saja
        const approved = res.data.filter(
          (r) => r.approval_status === "approved"
        );

        const total = approved.length;

        if (total === 0) {
          setLoading(false);
          return;
        }

        // Hitung jumlah Low/Medium/High
        const low = approved.filter((r) => r.criteria === "Low").length;
        const medium = approved.filter((r) => r.criteria === "Medium").length;
        const high = approved.filter((r) => r.criteria === "High").length;

        // Set persentase
        setLowPercent(Number(((low / total) * 100).toFixed(1)));
        setMediumPercent(Number(((medium / total) * 100).toFixed(1)));
        setHighPercent(Number(((high / total) * 100).toFixed(1)));
      } catch (error) {
        console.error("Gagal fetch residual risk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskResidual();
  }, []);

  const risiko = lowPercent;

  const statusLabel =
    risiko >= 60 ? "Tinggi" : risiko >= 30 ? "Sedang" : "Rendah";

  const statusColor =
    risiko >= 60
      ? "text-red-500"
      : risiko >= 30
      ? "text-orange-500"
      : "text-green-600";

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
      <h2 className="text-lg font-semibold text-[#131313] mb-4 lg:text-[22px]">
        Status Risiko Aktif
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          {/* Spinner */}
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex gap-10 md:flex-col md:items-center md:gap-6 lg:flex-row lg:justify-between">
          {/* Gauge */}
          <div className="relative w-38 h-24 lg:w-60 lg:h-40">
            <svg viewBox="0 0 100 50" className="w-full h-full">
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

            <div className="absolute inset-0 flex flex-col items-center justify-end mb-2">
              <span className="text-xl font-bold text-gray-800 lg:text-[32px]">
                {risiko}%
              </span>
              <span
                className={`text-sm font-medium lg:text-[14px] ${statusColor}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 text-sm text-[12px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              Risiko Rendah – {lowPercent}%
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
              Risiko Sedang – {mediumPercent}%
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Risiko Tinggi – {highPercent}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
