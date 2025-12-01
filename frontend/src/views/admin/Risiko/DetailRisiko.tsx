/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import RisikoHeader from "../../../components/risiko/dinas/RisikoHeader";
import RisikoDetailCard from "../../../components/risiko/dinas/RisikoDetailCard";
import RencanaMitigasiCard from "../../../components/risiko/dinas/RencanaMitigasiCard";
import RiwayatAktivitasCard from "../../../components/risiko/dinas/RiwayatAktivitasCard";
import ButtonCard from "../../../components/button/Button";

export default function RisikoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <p className="text-center py-10 text-gray-500">
        Memuat data risiko...
      </p>
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
            onClick={() => {
              if (data?.id) {
                // === FIX: gunakan risk_id ===
                navigate(`/risiko-admin/edit-risiko/${data.id}`);
              } else {
                alert("Risk ID tidak ditemukan!");
              }
            }}
          />
        </div>
      </div>

      {/* ---------------- Konten ---------------- */}
      <div className="mt-5">
        <div className="rounded-2xl space-y-6">
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
          <RiwayatAktivitasCard aktivitasList={data.aktivitas ?? []} />
          <RencanaMitigasiCard riskId={data.id} />
        </div>
      </div>
    </>
  );
}
