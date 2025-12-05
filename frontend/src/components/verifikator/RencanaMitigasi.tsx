import { useEffect, useState } from "react";
import axios from "axios";

type Mitigasi = {
  aksi: string;
  status: string;
  targetTanggal: string;
  pemilik: string;
};

type RencanaMitigasiCardProps = {
  riskId: string;
};

export default function RencanaMitigasi({ riskId }: RencanaMitigasiCardProps) {
  const [mitigasiList, setMitigasiList] = useState<Mitigasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMitigasi = async () => {
      try {
        const token = localStorage.getItem("token"); // ambil token dari localStorage
        const response = await axios.get(
          `https://asset-risk-management.vercel.app/api/risk-treatments?risk_id=${riskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Mapping API response ke tipe Mitigasi
        const mapped: Mitigasi[] = response.data.map((item: any) => ({
          aksi: item.action || "Belum ada aksi",
          status: item.status || "planned",
          targetTanggal: item.target_date
            ? new Date(item.target_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-",
          pemilik: item.action_owner || "-",
        }));

        setMitigasiList(mapped);
      } catch (error) {
        console.error("Gagal ambil data mitigasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMitigasi();
  }, [riskId]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Memuat rencana mitigasi...</p>;

  // 🎨 Warna badge status
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("selesai"))
      return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("proses"))
      return "bg-blue-100 text-blue-700 whitespace-nowrap";
    if (status.toLowerCase().includes("belum") || status === "planned")
      return "bg-gray-200 text-gray-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Aksi Penanganan</h2>

      {mitigasiList.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada rencana mitigasi ditambahkan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="border-b border-gray-300 text-gray-700">
              <tr>
                <th className="py-4 font-bold">Aksi</th>
                <th className="py-4 font-bold">Status</th>
                <th className="py-4 font-bold">Target Tanggal</th>
                <th className="py-4 font-bold">Pemilik</th>
              </tr>
            </thead>
            <tbody>
              {mitigasiList.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-3 text-gray-800 font-medium">{item.aksi}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-gray-800">{item.targetTanggal}</td>
                  <td className="py-3 font-medium text-gray-800">{item.pemilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
