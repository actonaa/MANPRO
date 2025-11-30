/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ pastikan kamu pakai react-router
import RisikoHeader from "../../../components/risiko/dinas/RisikoHeader";
import RisikoDetailCard from "../../../components/risiko/dinas/RisikoDetailCard";
import RencanaMitigasiCard from "../../../components/risiko/admin/RencanaMitigasiCard";
import RiwayatAktivitasCard from "../../../components/risiko/dinas/RiwayatAktivitasCard";
import ButtonCard from "../../../components/button/Button";
import ModalHapusRisiko from "../../../components/form/Admin/HapisRisiko";

export default function DetailRisiko() {
  const { id } = useParams(); // ambil id dari URL misalnya /risiko/detail/:id
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [openHapus, setOpenHapus] = useState(false);

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

  if (loading)
    return (
      <>
        <p className="text-center py-10 text-gray-500">Memuat data risiko...</p>
      </>
    );

  if (!data)
    return (
      <>
        <p className="text-center py-10 text-red-500">
          Gagal memuat detail risiko.
        </p>
      </>
    );

  return (
    <>
      {/* 🔥 Header + Tombol Edit sejajar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <RisikoHeader
          title={data.title}
          criteria={data.criteria?.name}
          status={data.status}
        />
        <div className="w-full md:w-auto flex gap-3">
          <ButtonCard
            title="Edit Detail Risiko"
            color="#007DFA"
            hoverColor="#0066cc"
            textColor="#ffffff"
            borderColor="#007DFA"
            justify="justify-center"
            fontWeight="font-semibold"
            onClick={() => console.log("/risiko-admin/edit", data.id)}
          />
          <ButtonCard
            title="Hapus Risiko"
            color="#FECACA"
            hoverColor="#FCA5A5"
            textColor="#B91C1C"
            borderColor="#FECACA"
            justify="justify-center"
            fontWeight="font-semibold"
            onClick={() => setOpenHapus(true)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <RiwayatAktivitasCard aktivitasList={data.aktivitas} />
            <RencanaMitigasiCard riskId={data.id} />
          </div>
        </div>
        <ModalHapusRisiko
          open={openHapus}
          onClose={() => setOpenHapus(false)}
          judul={data.title}
          onConfirm={() => {
            console.log("Hapus Risiko:", data.id);
            setOpenHapus(false);
          }}
        />
      </div>
    </>
  );
}
