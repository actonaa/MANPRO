/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import RisikoResidual from "../../../components/kelola-risiko/dinas/RisikoResidual";
import Top10Risiko from "../../../components/kelola-risiko/dinas/Top10Resiko";
import ButtonText from "../../../components/button/ButtonText";
import CardList from "../../../components/card/CardList";

export default function KelolaRisiko() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/risks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setRisks(data);
      } catch (error) {
        console.error("Gagal fetch risks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, []);

  const totalRisiko = risks.length;

  const risikoTinggi = risks.filter((r) => r.entry_level >= 16).length;
  const risikoSedang = risks.filter(
    (r) => r.entry_level >= 8 && r.entry_level < 16
  ).length;
  const risikoRendah = risks.filter((r) => r.entry_level < 8).length;

  const handleLihatRisiko = () => {
    window.location.href = "/risiko/data";
  };

  return (
    <>
      <div className="mb-5 px-4 md:px-0 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-semibold">Daftar Risiko</h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola dan pantau seluruh risiko aset yang teridentifikasi.
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <ButtonText
            title="Lihat Daftar Risiko"
            onClick={handleLihatRisiko}
            color="bg-[#007DFA]"
            hoverColor="hover:bg-[#0069D5]"
            textColor="text-white"
            fontWeight="font-semibold"
          />
        </div>
      </div>

      {/* CARD LIST */}
      <div className="mb-5 overflow-x-auto pb-6 md:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList
            title="Total Risiko"
            value={totalRisiko.toString()}
            loading={loading}
          />
          <CardList
            title="Risiko Tinggi"
            value={risikoTinggi.toString()}
            loading={loading}
          />
          <CardList
            title="Risiko Sedang"
            value={risikoSedang.toString()}
            loading={loading}
          />
          <CardList
            title="Risiko Rendah"
            value={risikoRendah.toString()}
            loading={loading}
          />
        </div>
      </div>

      {/* BAGIAN RESIDUAL & HEATMAP */}
      <div className="flex flex-col md:flex-row mt-6 md:gap-6 lg:gap-4">
        <div className="flex-1 rounded-2xl mb-6 md:mb-0">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg w-full h-full flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <RisikoResidual
              rendah={risikoRendah}
              sedang={risikoSedang}
              tinggi={risikoTinggi}
            />
          )}
        </div>

        <div className="flex-2 rounded-2xl shadow-lg p-12 bg-white mb-6 md:mb-0">
          <img
            src="/kelola-risiko/heatmap-risiko.png"
            alt="Heatmap Risiko"
            className="w-full h-full rounded-xl"
          />
        </div>
      </div>

      {/* TOP 10 RISIKO */}
      <Top10Risiko />
    </>
  );
}
