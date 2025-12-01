/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RisikoHeader from "../../components/risiko/dinas/RisikoHeader";
import RisikoDetailCard from "../../components/risiko/dinas/RisikoDetailCard";
import RencanaMitigasiCard from "../../components/no-button-card/RencanaMitigasi-Laporan";
import RiwayatAktivitasCard from "../../components/risiko/dinas/RiwayatAktivitasCard";

export default function DetailRisikoAuditor() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisikoDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://asset-risk-management.vercel.app/api/risks/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal memuat detail risiko");

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("❌ Gagal memuat detail risiko:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRisikoDetail();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Memuat data risiko...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-center py-10 text-red-500">
        Gagal memuat detail risiko.
      </p>
    );
  }

  return (
    <>
      {/* Header Risiko */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <RisikoHeader
          title={data.title}
          criteria={data.criteria || "-"}
          status={data.status}
        />
      </div>

      {/* Card Utama */}
      <div className="mt-5">
        <div className="bg-white rounded-2xl space-y-6 p-5">
          {/* Detail Risiko */}
          <RisikoDetailCard
            idRisiko={data.id}
            assetName={data.asset_info?.name || "-"}
            owner={data.owner || "-"}
            description={data.description || "-"}
            impact={data.impact || "-"}
            cause={data.cause || "-"}
            impactCriteria={data.impact_criteria || "-"}
            nilaiProbabilitas={data.probability || data.entry_level || 0}
            nilaiDampak={data.impact_score || 0}
            nilaiRisiko={data.probability * data.impact_score || 0}
            levelRisiko={data.criteria || "-"}
          />

          {/* Riwayat Aktivitas */}
          <RiwayatAktivitasCard aktivitasList={data.aktivitas || []} />

          {/* Rencana Mitigasi */}
          <RencanaMitigasiCard mitigasiList={data.mitigasi || []} />
        </div>
      </div>
    </>
  );
}
