import { useState } from "react";
import CardList from "../../components/card/CardList";
import Layout from "../../components/contanct/Layout";
import DistribusiKategori from "../../components/dashboard/DistribusiKategori";
import RiskHeatmap from "../../components/dashboard/RiskHeatMap";
import RisikoResidual from "../../components/dashboard/RisikoResidual";
import PemeliharaanMendatang from "../../components/dashboard/PemeliharaanMendatang";
import TableAktivitas from "../../components/table/TableAktivitas";

export default function Dashboard() {
  const [searchQuery] = useState("");
  return (
    <Layout>
      <h1 className="font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>
      <div className="mb-5 overflow-x-auto pb-6 md:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList title="Total Aset" value="1,250" />
          <CardList title="Aset Perlu Perbaikan" value="560" />
          <CardList title="Aset Akan Dihapus" value="200" />
          <CardList title="Risiko Aktif" value="499" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-stretch">
        <DistribusiKategori />
        <RiskHeatmap />
      </div>
      <div className="mb-6">
        <TableAktivitas searchQuery={searchQuery} />
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-stretch">
        <RisikoResidual />
        <PemeliharaanMendatang />
      </div>
    </Layout>
  );
}
