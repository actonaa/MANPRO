/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RisikoHeader from "../../components/risiko/dinas/RisikoHeader";
import ValueRisiko from "../../components/verifikator/ValueRisiko";
import RencanaMitigasi from "../../components/verifikator/RencanaMitigasi";
import RiwayatAktivitasCard from "../../components/risiko/dinas/RiwayatAktivitasCard";
import axios from "axios";

interface RisikoDetail {
  id: string;
  title: string;
  criteria: string;
  status: string;
  asset_name: string;
  owner?: string;
  description: string;
  impact: string;
  cause: string;
  impact_criteria?: string;
  probability_value?: number;
  impact_value?: number;
  risk_value?: number;
  risk_level?: string;
  mitigasi?: any[];
  aktivitas?: any[];
}

interface ApiRisikoResponse {
  id: string;
  title: string;
  criteria: string;
  status: string;
  asset_info?: { name: string };
  owner?: string;
  description: string;
  impact: string;
  cause: string;
  impact_criteria?: string;
  probability?: number;
  impact_score?: number;
  entry_level?: number;
  mitigasi?: any[];
  aktivitas?: any[];
  asset_id?: string;
}

export default function RisikoPage() {
  const [data, setData] = useState<RisikoDetail | null>(null);
  const [completionDate, setCompletionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [riwayatAktivitas, setRiwayatAktivitas] = useState<
    { tanggal: string; kegiatan: string; status: string }[]
  >([]);

  const token = localStorage.getItem("token");

  // ============================
  // FETCH RISIKO
  // ============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("Token tidak ditemukan di localStorage");

        const response = await axios.get<ApiRisikoResponse>(
          `https://asset-risk-management.vercel.app/api/risks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiData = response.data;

        const mappedData: RisikoDetail = {
          id: apiData.id,
          title: apiData.title,
          criteria: apiData.criteria || "-",
          status: apiData.status || "-",
          asset_name: apiData.asset_info?.name || "-",
          owner: apiData.owner || "-",
          description: apiData.description || "-",
          impact: apiData.impact || "-",
          cause: apiData.cause || "-",
          impact_criteria: apiData.impact_criteria || "-",
          probability_value: apiData.probability || 0,
          impact_value: apiData.impact_score || 0,
          risk_value: apiData.entry_level || 0,
          risk_level: apiData.criteria || "-",
          mitigasi: apiData.mitigasi || [],
          aktivitas: apiData.aktivitas || [],
        };

        // Fetch aktivitas maintenance berdasarkan asset_id
        const resMaintenance = await axios.get<any[]>(
          `https://asset-risk-management.vercel.app/api/maintenance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRiwayatAktivitas(
          resMaintenance.data
            .filter((m: any) => m.asset_id === apiData.asset_id)
            .map((m: any) => ({
              tanggal: m.completion_date,
              kegiatan: m.notes || "-",
              status: m.status,
            }))
        );

        setData(mappedData);
      } catch (error) {
        console.error("Gagal fetch data risiko:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // ============================
  // FETCH MAINTENANCE DATE (BERDASARKAN risk_id)
  // ============================
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        if (!token) throw new Error("Token tidak ditemukan");

        const response = await axios.get<any[]>(
          `https://asset-risk-management.vercel.app/api/maintenance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const match = response.data.find((item: any) => item.risk_id === id);

        setCompletionDate(match ? match.completion_date : null);
      } catch (error) {
        console.error("Gagal fetch maintenance:", error);
      }
    };

    fetchMaintenance();
  }, [id, token]);

  // ============================
  // STATE UNTUK MAPPED TREATMENT
  // ============================
  const [mappedTreatment, setMappedTreatment] = useState<any>({
    strategy: "-",
    targetDate: "-",
    costEstimation: "-",
    effectiveness: "-",
    probability: 0,
    impact: 0,
    residualValue: 0,
    residualLevel: "-",
  });

  // ============================
  // FETCH RISK-TREATMENTS (PASTI TAMPIL)
  // ============================
  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        if (!token) return;

        const res = await axios.get<{ data: any[] }>(
          `https://asset-risk-management.vercel.app/api/risk-treatments?risk_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const treatments = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const treatment = treatments[0] || null;

        const safe = (val: any, fallback = "-") =>
          val !== null && val !== undefined && val !== "" ? val : fallback;

        const getResidualText = (val: number) => {
          if (val >= 5) return "Tinggi";
          if (val >= 3) return "Sedang";
          return "Rendah";
        };

        if (treatment) {
          setMappedTreatment({
            strategy: safe(treatment.strategy),
            targetDate: safe(treatment.target_date),
            costEstimation: safe(treatment.cost),
            effectiveness: safe(treatment.effectiveness),
            probability: treatment.new_probability ?? 0,
            impact: treatment.new_impact_score ?? 0,
            residualValue: treatment.residual_level ?? 0,
            residualLevel: getResidualText(treatment.residual_level ?? 0),
          });
        } else {
          setMappedTreatment({
            strategy: "-",
            targetDate: "-",
            costEstimation: "-",
            effectiveness: "-",
            probability: 0,
            impact: 0,
            residualValue: 0,
            residualLevel: "-",
          });
        }
      } catch (err) {
        console.error("Gagal fetch treatment:", err);
      }
    };

    fetchTreatment();
  }, [id, token]);

  // ============================
  // LOADING & ERROR HANDLING
  // ============================
  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">Memuat data risiko...</p>
    );

  if (!data)
    return (
      <p className="text-center py-10 text-red-500">
        Data risiko tidak ditemukan.
      </p>
    );

  // ============================
  // RENDER PAGE
  // ============================
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-4">
        <div className="flex items-start gap-3">
          <ArrowLeft
            className="w-5 h-5 text-gray-700 mt-1 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Detail Risiko
            </h1>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <RisikoHeader
            title={data.title}
            status={data.status}
            criteria={data.criteria}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
            <div>
              <p className="text-gray-500 font-semibold">ID RISIKO</p>
              <p className="text-gray-900 mb-2">{data.id}</p>

              <p className="text-gray-500 font-semibold">NAMA ASET</p>
              <p className="text-gray-900 mb-2">{data.asset_name}</p>

              <p className="text-gray-500 font-semibold">DESKRIPSI</p>
              <p className="text-gray-900">{data.description}</p>

              <p className="text-gray-500 font-semibold mt-4">
                TANGGAL SELESAI MAINTENANCE
              </p>
              <p className="text-gray-900">
                {completionDate ? completionDate : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">DAMPAK</p>
              <p className="text-gray-900 mb-2">{data.impact}</p>

              <p className="text-gray-500 font-semibold">PENYEBAB</p>
              <p className="text-gray-900 mb-2">{data.cause}</p>

              <p className="text-gray-500 font-semibold">KRITERIA DAMPAK</p>
              <p className="text-gray-900">{data.impact_criteria}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-gray-200 mt-6 pt-4 text-center">
            <div>
              <p className="text-gray-500 text-sm font-semibold">
                NILAI PROBABILITAS
              </p>
              <p className="text-red-600 font-semibold text-lg">
                {data.probability_value}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm font-semibold">
                NILAI DAMPAK
              </p>
              <p className="text-red-600 font-semibold text-lg">
                {data.impact_value}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm font-semibold">
                NILAI RISIKO DASAR
              </p>
              <p className="text-red-600 font-semibold text-lg">
                {data.risk_value} – {data.risk_level}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="flex-[1]">
            <RencanaMitigasi riskId={data.id} />
          </div>

          <div className="flex-[1] flex flex-col gap-6">
            <ValueRisiko
              strategy={mappedTreatment.strategy}
              targetDate={mappedTreatment.targetDate}
              costEstimation={mappedTreatment.costEstimation}
              effectiveness={mappedTreatment.effectiveness}
              probability={mappedTreatment.probability}
              impact={mappedTreatment.impact}
              residualValue={mappedTreatment.residualValue}
              residualLevel={mappedTreatment.residualLevel}
            />

            <RiwayatAktivitasCard act={riwayatAktivitas} />
          </div>
        </div>
      </div>
    </>
  );
}
