import { useEffect, useState } from "react";
import axios from "axios";

interface RiskItem {
  title: string;
  entry_level: number;
  approval_status: string;
}

export default function RiskHeatmap() {
  const [risikoData, setRisikoData] = useState<
    { nama: string; persen: number; warna: string; kategori: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fungsi warna sama seperti Top10Risiko
  const getColorByLevel = (entryLevel: number) => {
    if (entryLevel >= 16) return "bg-red-600"; // tinggi
    if (entryLevel >= 8) return "bg-orange-400"; // sedang
    return "bg-green-400"; // rendah
  };

  const getKategoriLevel = (entryLevel: number) => {
    if (entryLevel >= 16) return "tinggi";
    if (entryLevel >= 8) return "sedang";
    return "rendah";
  };

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<RiskItem[]>(
          "https://asset-risk-management.vercel.app/api/risks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const risks = res.data;

        const approved = risks.filter(
          (item) => item.approval_status === "approved"
        );

        if (approved.length === 0) {
          setLoading(false);
          return;
        }

        // Urutkan berdasarkan entry level
        const sorted = approved.sort((a, b) => b.entry_level - a.entry_level);

        // Ambil Top 10
        const top10 = sorted.slice(0, 10);

        // Ambil entry level tertinggi sebagai 100%
        const maxEntry = top10[0].entry_level;

        // Map data ke format baru
        const mapped = top10.map((item) => {
          const persen = Math.round((item.entry_level / maxEntry) * 100);

          return {
            nama: item.title,
            persen,
            warna: getColorByLevel(item.entry_level),
            kategori: getKategoriLevel(item.entry_level),
          };
        });

        setRisikoData(mapped);
      } catch (error) {
        console.error("Gagal fetch risiko:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg w-full h-full mt-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Top 10 Risiko
      </h3>

      {loading ? (
        <div className="w-full flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-5">
          {risikoData.length > 0 ? (
            risikoData.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Risiko {idx + 1}: {item.nama} ({item.kategori})
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${item.warna} h-3 transition-all duration-500 rounded-none`}
                    style={{ width: `${item.persen}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Tidak ada data risiko.</p>
          )}
        </div>
      )}
    </div>
  );
}
