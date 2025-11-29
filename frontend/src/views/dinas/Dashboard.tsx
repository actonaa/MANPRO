import { useState, useEffect } from "react";
import CardList from "../../components/card/CardList";
import RiskHeatmap from "../../components/dashboard/dinas/RiskHeatMap";
import RisikoResidual from "../../components/dashboard/dinas/RisikoResidual";
import PemeliharaanMendatang from "../../components/dashboard/dinas/PemeliharaanMendatang";
import TableAktivitas from "../../components/table/TableAktivitas";
import DistribusiKategori from "../../components/dashboard/dinas/DistribusiKategori";
import axios from "axios";

interface Asset {
  status?: {
    name?: string;
  };
}

interface Risk {
  approval_status?: string;
}

export default function Dashboard() {
  const [searchQuery] = useState("");

  const [totalAset, setTotalAset] = useState(0);
  const [asetPerbaikan, setAsetPerbaikan] = useState(0);
  const [asetAkanDihapus, setAsetAkanDihapus] = useState(0);
  const [totalRisk, setTotalRisk] = useState(0);

  // 🔹 Loading state untuk spinner
  const [loadingAset, setLoadingAset] = useState(true);
  const [loadingRisk, setLoadingRisk] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAset = async () => {
      try {
        const res = await axios.get<Asset[]>(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;

        setTotalAset(data.length);
        setAsetPerbaikan(
          data.filter((item) => item.status?.name === "Pemeliharaan").length
        );
        setAsetAkanDihapus(
          data.filter((item) => item.status?.name === "Akan Dihapus").length
        );
      } catch (error) {
        console.error("Gagal fetch asset:", error);
      } finally {
        setLoadingAset(false);
      }
    };

    const fetchRisk = async () => {
      try {
        const res = await axios.get<Risk[]>(
          "https://asset-risk-management.vercel.app/api/risks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const risks = res.data;

        const activeRisk = risks.filter(
          (item) => item.approval_status === "approved"
        ).length;

        setTotalRisk(activeRisk);
      } catch (error) {
        console.error("Gagal fetch risk:", error);
      } finally {
        setLoadingRisk(false);
      }
    };

    fetchAset();
    fetchRisk();
  }, []);

  return (
    <>
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList
            title="Total Aset"
            value={totalAset.toString()}
            loading={loadingAset}
          />

          <CardList
            title="Aset Perlu Perbaikan"
            value={asetPerbaikan.toString()}
            loading={loadingAset}
          />

          <CardList
            title="Aset Akan Dihapus"
            value={asetAkanDihapus.toString()}
            loading={loadingAset}
          />

          <CardList
            title="Risiko Aktif"
            value={totalRisk.toString()}
            loading={loadingRisk}
          />
        </div>
      </div>

      {/* 📈 Distribusi & Risiko */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1 w-full">
          <DistribusiKategori />
        </div>

        <div className="lg:col-span-1 w-full">
          <RiskHeatmap />
        </div>
      </div>

      {/* 📋 Aktivitas Aset */}
      <div className="w-full mb-6">
        <TableAktivitas searchQuery={searchQuery} />
      </div>

      {/* 📊 Risiko Residual & Pemeliharaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        <RisikoResidual />
        <PemeliharaanMendatang />
      </div>
    </>
  );
}
