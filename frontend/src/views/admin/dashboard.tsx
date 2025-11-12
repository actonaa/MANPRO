import CardList from "../../components/card/CardList";
import RiskHeatmap from "../../components/dashboard/dinas/RiskHeatMap";
import PemeliharaanTrendCard from "../../components/dashboard/auditor/PemeliharaanTrendCard";
import TabelDashboardAdmin from "../../components/table/TabelDashboardAdmin";
export default function Dashboard() {
  // 🧩 Tambahkan dummy data di sini
  const dummyData = [
    {
      dinas: "Dinas Pariwisata",
      verifikasi: "98%",
      risiko: 12,
      kepatuhan: "90%",
    },
    {
      dinas: "Dinas Pendidikan",
      verifikasi: "82%",
      risiko: 20,
      kepatuhan: "87%",
    },
    {
      dinas: "Dinas Perhubungan",
      verifikasi: "90%",
      risiko: 19,
      kepatuhan: "93%",
    },
  ];
  return (
    <>
      <h1 className="ffont-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>
      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList title="Aset Aktif" value="1,250" />
          <CardList title="Aset Dalam Pemeliharaan" value="560" />
          <CardList title="Aset Dalam Perawatan" value="200" />
          <CardList title="Aset Habis Masa Pakai" value="499" />
          <CardList title="Aset Yang Terverifikasi" value="499" />
        </div>
      </div>
      {/* Pemeliharaan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pemeliharaan */}
        <div className="lg:col-span-1 w-full">
          <PemeliharaanTrendCard />
        </div>

        {/* Top 10 Risiko */}
        <div className="lg:col-span-1 w-full">
          <RiskHeatmap />
        </div>
        {/* Tabel */}
        <div className="col-span-full w-full mb-6">
          <TabelDashboardAdmin data={dummyData} />
        </div>
      </div>
    </>
  );
}
