/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import ButtonImg from "../../button/ButtonImg";
import { useAuth } from "../../../routes/ProtectedRouteBase";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

type Mitigasi = {
  aksi: string;
  status: string;
  targetTanggal: string;
  strategi: string;
  biaya: string;
  pemilik: string;
  efektivitas: string;
  nilaiProbabilitas: number;
  nilaiDampak: number;
  nilaiResidual: number;
};

type RencanaMitigasiCardProps = {
  riskId: string; // riskId dari parent
};

export default function RencanaMitigasiCard({
  riskId,
}: RencanaMitigasiCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mitigasiList, setMitigasiList] = useState<Mitigasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleNavigate = () => {
    if (!user) return;

    switch (user.role) {
      case "teknisi":
        navigate(`/risiko/mitigasi/${riskId}`);
        break;
      case "admin_diskominfo":
        navigate(`/risiko-admin/tambah-mitigasi/${riskId}`);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const fetchMitigasi = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://asset-risk-management.vercel.app/api/risk-treatments?risk_id=${riskId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ❗ Jika API gagal → pakai dummy
        if (!res.ok) throw new Error("Gagal memuat rencana mitigasi");

        const data = await res.json();

        // 🔥 MAP API → UI MODEL
        const mapped = data.map((item: any) => ({
          aksi: item.action,
          status: item.status,
          targetTanggal: item.target_date,
          strategi: item.strategy,
          biaya: item.cost,
          pemilik: item.action_owner,
          efektivitas: item.effectiveness,
          nilaiProbabilitas: item.new_probability,
          nilaiDampak: item.new_impact_score,
          nilaiResidual: item.residual_level,
        }));

        setMitigasiList(mapped);
      } catch (err: any) {
        console.error(err);

        // ================================
        // 🔥 DUMMY DATA (fallback)
        // ================================
        setMitigasiList([
          {
            aksi: "Pemasangan CCTV tambahan",
            status: "Dalam Proses",
            targetTanggal: "2025-01-20",
            strategi: "Mitigation",
            biaya: "Rp 5.000.000",
            pemilik: "Dinas Kominfo",
            efektivitas: "Tinggi",
            nilaiProbabilitas: 2,
            nilaiDampak: 3,
            nilaiResidual: 1,
          },
          {
            aksi: "Audit keamanan jaringan",
            status: "Belum Dimulai",
            targetTanggal: "2025-02-10",
            strategi: "Mitigation",
            biaya: "Rp 8.000.000",
            pemilik: "Tim IT",
            efektivitas: "Sedang",
            nilaiProbabilitas: 3,
            nilaiDampak: 4,
            nilaiResidual: 2,
          },
          {
            aksi: "Pelatihan keamanan data",
            status: "Selesai",
            targetTanggal: "2024-12-15",
            strategi: "Acceptance",
            biaya: "Rp 2.000.000",
            pemilik: "HRD",
            efektivitas: "Rendah",
            nilaiProbabilitas: 1,
            nilaiDampak: 2,
            nilaiResidual: 1,
          },
        ]);

        setError(""); // error dihilangkan agar dummy tetap tampil
      } finally {
        setLoading(false);
      }
    };

    if (riskId) fetchMitigasi();
  }, [riskId]);

  const canAdd = user?.role === "teknisi" || user?.role === "admin_diskominfo";

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("selesai"))
      return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("proses"))
      return "bg-blue-100 text-blue-700";
    if (status.toLowerCase().includes("belum"))
      return "bg-gray-200 text-gray-700";
    return "bg-gray-100 text-gray-600";
  };

  // ====================
  // Fetch mitigasi dari API
  // ====================
  useEffect(() => {
    const fetchMitigasi = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://asset-risk-management.vercel.app/api/risk-treatments?risk_id=${riskId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal memuat rencana mitigasi");

        const data = await res.json();

        // 🔥 MAP API → UI MODEL
        const mapped = data.map((item: any) => ({
          aksi: item.action,
          status: item.status,
          targetTanggal: item.target_date,
          strategi: item.strategy,
          biaya: item.cost,
          pemilik: item.action_owner,
          efektivitas: item.effectiveness,
          nilaiProbabilitas: item.new_probability,
          nilaiDampak: item.new_impact_score,
          nilaiResidual: item.residual_level,
        }));

        setMitigasiList(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (riskId) fetchMitigasi();
  }, [riskId]);

  if (loading)
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded mt-2 md:mt-0"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="border-b border-b-gray-200">
              <tr>
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <th key={i} className="py-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(4)
                .fill(null)
                .map((_, row) => (
                  <tr key={row} className="border-b border-b-gray-200">
                    {Array(10)
                      .fill(null)
                      .map((_, col) => (
                        <td key={col} className="py-3">
                          <div className="h-4 w-full bg-gray-200 rounded"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  if (error) return <p className="text-red-500 py-4 text-center">{error}</p>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2 md:mb-0">
          Aksi Penanganan
        </h2>

        {canAdd && (
          <ButtonImg
            title="Tambah Aksi"
            img="/kelola-asset/tambah-asset.png"
            color="#00a9ff"
            hoverColor="#a0e9ff"
            borderColor="#00a9ff"
            textColor="white"
            px="2"
            fontWeight="font-medium"
            wFull="w-40"
            paddingY="py-0"
            onClick={handleNavigate}
          />
        )}
      </div>
      {mitigasiList.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-gray-600">
              <tr>
                <th className="py-2 font-bold">Aksi</th>
                <th className="py-2 font-bold">Status</th>
                <th className="py-2 font-bold">Target Tanggal</th>
                <th className="py-2 font-bold">Strategi</th>
                <th className="py-2 font-bold">Biaya</th>
                <th className="py-2 font-bold">Pemilik</th>
                <th className="py-2 font-bold">Efektivitas</th>
                <th className="py-2 font-bold">Nilai Probabilitas</th>
                <th className="py-2 font-bold">Nilai Dampak</th>
                <th className="py-2 font-bold">Nilai Residual</th>

                {/* 🆕 Kolom edit */}
                <th className="py-2 font-bold text-center">Edit</th>
              </tr>
            </thead>

            <tbody>
              {mitigasiList.map((item) => (
                <tr
                  key={item.aksi + item.targetTanggal}
                  className="border-b border-b-gray-200"
                >
                  <td className="py-6 text-gray-800 font-medium">
                    {item.aksi}
                  </td>
                  <td className="py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.targetTanggal}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.strategi}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.biaya}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.pemilik}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.efektivitas}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.nilaiProbabilitas}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.nilaiDampak}
                  </td>
                  <td className="py-6 font-medium text-gray-800">
                    {item.nilaiResidual}
                  </td>

                  {/* 🆕 ICON EDIT - Lucide Pencil */}
                  <td className="py-6 text-center">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                      title="Edit Aksi"
                      onClick={() =>
                        navigate(`/risiko-admin/edit?aksi=${item.aksi}`)
                      }
                    >
                      <Pencil
                        size={18}
                        className="text-gray-500 hover:text-blue-600 transition"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">
          Belum ada rencana mitigasi ditambahkan.
        </p>
      )}
    </div>
  );
}
