import { useEffect, useState } from "react";
import CardList from "../../components/card/CardList";
import RiskHeatmap from "../../components/dashboard/dinas/RiskHeatMap";
import PemeliharaanTrendCard from "../../components/dashboard/auditor/PemeliharaanTrendCard";
import AktivitasSistemTerkini from "../../components/dashboard/auditor/AktivitasSistemTerkini";

interface Asset {
  status?: {
    name?: string;
  };
  approval_status?: string;
}

export default function Dashboard() {
  const [asetAktif, setAsetAktif] = useState<number>(0);
  const [loadingAset, setLoadingAset] = useState<boolean>(true);

  const [asetPemeliharaan, setAsetPemeliharaan] = useState<number>(0);
  const [loadingPemeliharaan, setLoadingPemeliharaan] = useState<boolean>(true);

  const [asetNonAktif, setAsetNonAktif] = useState<number>(0);
  const [loadingNonAktif, setLoadingNonAktif] = useState<boolean>(true);

  const [asetPending, setAsetPending] = useState<number>(0);
  const [loadingPending, setLoadingPending] = useState<boolean>(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoadingAset(true);
        setLoadingPemeliharaan(true);
        setLoadingNonAktif(true);
        setLoadingPending(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: Asset[] = await res.json();

        // Filter status "Aktif"
        const aktif = data.filter(
          (item: Asset) => item.status?.name === "Aktif"
        );
        setAsetAktif(aktif.length);

        // Filter status "Pemeliharaan"
        const pemeliharaan = data.filter(
          (item: Asset) => item.status?.name === "Pemeliharaan"
        );
        setAsetPemeliharaan(pemeliharaan.length);

        const nonaktif = data.filter(
          (item: Asset) => item.status?.name === "Tidak Aktif"
        );
        setAsetNonAktif(nonaktif.length);

        // Filter approval_status "pending"
        const pending = data.filter(
          (item: Asset) => item.approval_status === "pending"
        );
        setAsetPending(pending.length);
      } catch (error) {
        console.error("Gagal mengambil data aset:", error);
      } finally {
        setLoadingAset(false);
        setLoadingPemeliharaan(false);
        setLoadingNonAktif(false);
        setLoadingPending(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <>
      <h1 className="ffont-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>

      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          {/* Aset Aktif (dinamis) */}
          <CardList
            title="Aset Aktif"
            value={asetAktif}
            loading={loadingAset}
          />

          {/* Aset Dalam Pemeliharaan (dinamis) */}
          <CardList
            title="Aset Dalam Pemeliharaan"
            value={asetPemeliharaan}
            loading={loadingPemeliharaan}
          />

          {/* Aset Dalam Perawatan (static) */}
          <CardList
            title="Aset Non Aktif"
            value={asetNonAktif}
            loading={loadingNonAktif}
          />

          {/* Aset Belum Terverifikasi (dinamis dari approval_status: pending) */}
          <CardList
            title="Aset Yang Belum Terverifikasi"
            value={asetPending}
            loading={loadingPending}
          />
        </div>
      </div>

      {/* Pemeliharaan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1 w-full">
          <PemeliharaanTrendCard />
        </div>

        <div className="lg:col-span-1 w-full">
          <RiskHeatmap />
        </div>

        <div className="col-span-full w-full mb-6">
          <AktivitasSistemTerkini />
        </div>
      </div>
    </>
  );
}
