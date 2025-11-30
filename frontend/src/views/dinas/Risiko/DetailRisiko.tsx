/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RisikoHeader from "../../../components/risiko/dinas/RisikoHeader";
import RisikoDetailCard from "../../../components/risiko/dinas/RisikoDetailCard";
import RencanaMitigasiCard from "../../../components/risiko/dinas/RencanaMitigasiCard";
import RiwayatAktivitasCard from "../../../components/risiko/dinas/RiwayatAktivitasCard";
import ButtonCard from "../../../components/button/Button";

export default function RisikoPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [riwayatAktivitas, setRiwayatAktivitas] = useState<
    { tanggal: string; kegiatan: string; status: string }[]
  >([]);

  // ============================
  //   FETCH DETAIL RISIKO
  // ============================
  useEffect(() => {
    const fetchRisikoDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/risks/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat detail risiko");

        const json = await res.json();
        setData(json);

        // Fetch semua maintenance
        const resMaintenance = await fetch(`/api/maintenance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataMaintenance = await resMaintenance.json();

        // Filter berdasarkan asset_id dari API risks
        setRiwayatAktivitas(
          dataMaintenance
            .filter((m: any) => m.asset_id === json.asset_id)
            .map((m: any) => ({
              tanggal: m.completion_date,
              kegiatan: m.notes || "-",
              status: m.status,
            }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRisikoDetail();
  }, [id]);

  // ============================
  //   LOADING / ERROR STATES
  // ============================
  if (loading)
    return (
      <div className="animate-pulse space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="space-y-3 w-full">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-8 w-64 bg-gray-300 rounded"></div>

            <div className="flex items-center gap-4">
              <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <div className="h-10 w-40 bg-gray-300 rounded mt-4 md:mt-0"></div>
        </div>

        {/* Detail Risiko Card Skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="h-5 w-48 bg-gray-200 rounded"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {Array(8)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-5 w-full bg-gray-300 rounded"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Riwayat Aktivitas Skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded"></div>

          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 rounded-lg space-y-2"
              >
                <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
            ))}
        </div>

        {/* Rencana Mitigasi Skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 overflow-x-auto">
          <div className="flex justify-between items-center">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <th key={i} className="py-2">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {Array(3)
                .fill(null)
                .map((_, row) => (
                  <tr key={row}>
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

  if (!data)
    return (
      <p className="text-center py-10 text-red-500">
        Gagal memuat detail risiko.
      </p>
    );

  return (
    <>
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <RisikoHeader
          title={data.title ?? "-"}
          criteria={data.criteria ?? "-"}
          status={data.approval_status ?? "-"}
        />
        <div className="w-full md:w-auto">
          <ButtonCard
            title="Edit Detail Risiko"
            color="#007DFA"
            hoverColor="#0066cc"
            textColor="#ffffff"
            borderColor="#007DFA"
            justify="justify-center"
            fontWeight="font-semibold"
            onClick={() => console.log("Edit Risiko:", data.id)}
          />
        </div>
      </div>

      {/* ---------------- Konten ---------------- */}
      <div className="mt-5">
        <div className=" rounded-2xl space-y-6">
          {/* ===============================
              DETAIL RISIKO
          ================================== */}
          <RisikoDetailCard
            idRisiko={data.id}
            assetName={data.asset_info?.name ?? "-"}
            owner={data.department?.name ?? "-"}
            description={data.description ?? "-"}
            impact={data.impact ?? "-"}
            cause={data.cause ?? "-"}
            impactCriteria={data.criteria ?? "-"}
            nilaiProbabilitas={data.probability ?? 0}
            nilaiDampak={data.impact_score ?? 0}
            nilaiRisiko={(data.probability ?? 0) * (data.impact_score ?? 0)}
            levelRisiko={data.criteria ?? "-"}
            areaDampak={data.impact_area?.name ?? "-"}
            kategoriRisiko={data.risk_category?.name ?? "-"}
            jenis={data.type_of_risk ?? "-"}
            tipeAset={data.type ?? "-"}
          />

          {/* ===============================
                Aktivitas / Mitigasi
          ================================== */}
          <RiwayatAktivitasCard act={riwayatAktivitas} />
          <RencanaMitigasiCard riskId={data.id} />
        </div>
      </div>
    </>
  );
}
