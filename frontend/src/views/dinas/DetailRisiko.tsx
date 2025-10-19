import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ pastikan kamu pakai react-router
import LayoutDinas from "../layout/LayoutDinas";
import RisikoHeader from "../../components/risiko/dinas/RisikoHeader";
import RisikoDetailCard from "../../components/risiko/dinas/RisikoDetailCard";
import RencanaMitigasiCard from "../../components/risiko/dinas/RencanaMitigasiCard";
import RiwayatAktivitasCard from "../../components/risiko/dinas/RiwayatAktivitasCard";
import ButtonCard from "../../components/button/Button";
import ValueRisiko from "../../components/risiko/dinas/ValueRisiko";

export default function RisikoPage() {
  const { id } = useParams(); // ambil id dari URL misalnya /risiko/detail/:id
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisikoDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `/api/risks/${id}`,
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRisikoDetail();
  }, [id]);

  if (loading)
    return (
      <LayoutDinas>
        <p className="text-center py-10 text-gray-500">Memuat data risiko...</p>
      </LayoutDinas>
    );

  if (!data)
    return (
      <LayoutDinas>
        <p className="text-center py-10 text-red-500">
          Gagal memuat detail risiko.
        </p>
      </LayoutDinas>
    );

  return (
    <LayoutDinas>
      {/* 🔥 Header + Tombol Edit sejajar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <RisikoHeader
          title={data.title}
          criteria={data.criteria?.name}
          status={data.status}
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

      {/* 🧩 Card utama */}
      <div className="mt-5">
        <div className="bg-white rounded-2xl space-y-6">
          {/* 📊 Detail Risiko */}
          <RisikoDetailCard
            idRisiko={data.id}
            assetName={data.asset_name}
            owner={data.owner}
            description={data.description}
            impact={data.impact}
            cause={data.cause}
            impactCriteria={data.impact_criteria}
            nilaiProbabilitas={data.probability_value}
            nilaiDampak={data.impact_value}
            nilaiRisiko={data.risk_value}
            levelRisiko={data.risk_level}
          />

          {/* 🔧 Layout 2 kolom untuk Mitigasi & Value */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* 📁 Kiri: Rencana Mitigasi */}
            <RencanaMitigasiCard mitigasiList={data.mitigasi} />

            {/* 📁 Kanan: Value Risiko + Riwayat Aktivitas */}
            <div className="space-y-6">
              <ValueRisiko
                strategy={data.strategy}
                targetDate={data.target_date}
                costEstimation={data.cost_estimation}
                effectiveness={data.effectiveness}
                probability={data.probability}
                impact={data.impact}
                residualValue={data.residual_value}
                residualLevel={data.residual_level}
              />

              <RiwayatAktivitasCard aktivitasList={data.aktivitas} />
            </div>
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}
