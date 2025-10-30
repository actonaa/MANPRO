/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RisikoHeader from "../../components/risiko/dinas/RisikoHeader";
import RiwayatAktivitasCard from "../../components/risiko/dinas/RiwayatAktivitasCard";
import ValueRisiko from "../../components/verifikator/ValueRisiko";
import RencanaMitigasi from "../../components/verifikator/RencanaMitigasi";

export default function RisikoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const {} = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const dummyData = {
      id: "RISK-102-2025",
      title: "Serangan Siber",
      criteria: "TINGGI",
      status: "approved",
      asset_name: "Server",
      owner: "Syahroni",
      description:
        "Risiko ini dapat menyebabkan kebocoran data, gangguan operasional, kehilangan kepercayaan publik, serta kerugian finansial.",
      impact: "Kebocoran data, Gangguan Layanan.",
      cause: "Kelemahan keamanan sistem, Kelalaian Pengguna.",
      impact_criteria:
        "Keterlambatan layanan < 1 jam tanpa kerugian finansial.",
      probability_value: 5,
      impact_value: 5,
      risk_value: 25,
      risk_level: "TINGGI",

      mitigasi: [
        {
          id: "M-01",
          aksi: "Meningkatkan keamanan sistem.",
          penanggung_jawab: "Syahroni",
          tenggat: "2025-10-10",
          status: "Dalam proses",
        },
        {
          id: "M-02",
          aksi: "Pelatihan keamanan siber untuk staf.",
          penanggung_jawab: "Aulia",
          tenggat: "2025-11-01",
          status: "Belum diproses",
        },
      ],

      aktivitas: [
        {
          id: "A-01",
          tanggal: "2025-10-09",
          deskripsi: "Audit keamanan sistem oleh tim internal",
          status: "Selesai",
        },
        {
          id: "A-02",
          tanggal: "2025-09-02",
          deskripsi: "Pembaruan firewall dan patch keamanan",
          status: "Selesai",
        },
      ],
    };

    setTimeout(() => {
      setData(dummyData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">Memuat data risiko...</p>
    );

  return (
    <>
      {/* 🔹 Header Atas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-4">
        {/* 🔙 Tombol Back + Info */}
        <div className="flex items-start gap-3">
          <ArrowLeft
            className="w-5 h-5 text-gray-700 mt-1 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Detail RIsiko
            </h1>
          </div>
        </div>
      </div>
      <div className="p-5">
        {/* 🔹 Header Risiko */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <RisikoHeader
              title={data.title}
              status={data.status}
              criteria={data.criteria}
            />
          </div>

          {/* 📄 Detail Risiko Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
            <div>
              <p className="text-gray-500 font-semibold">ID RISIKO</p>
              <p className="text-gray-900 mb-2">{data.id}</p>

              <p className="text-gray-500 font-semibold">NAMA ASET</p>
              <p className="text-gray-900 mb-2">{data.asset_name}</p>

              <p className="text-gray-500 font-semibold">DESKRIPSI</p>
              <p className="text-gray-900">{data.description}</p>
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

          {/* 📊 Nilai Risiko Dasar */}
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

        {/* 🔸 Rencana Mitigasi + Value + Aktivitas */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* 📁 Rencana Mitigasi */}
          <div className="flex-[1]">
            <RencanaMitigasi
              mitigasiList={data.mitigasi.map((item: any) => ({
                aksi: item.aksi,
                status: item.status,
                targetTanggal: item.tenggat,
                pemilik: item.penanggung_jawab,
              }))}
            />
          </div>

          {/* 📋 Value & Aktivitas */}
          <div className="flex-[1] flex flex-col gap-6">
            <ValueRisiko />
            <RiwayatAktivitasCard aktivitasList={data.aktivitas} />
          </div>
        </div>
      </div>
    </>
  );
}
