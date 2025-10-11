import Card from "../../components/card/CardDshbrd";
import TrendChart from "../../components/dashboard/TrendChart";
import Notifications from "../../components/dashboard/Notifications";
import TopRisk from "../../components/dashboard/TopRisk";
import Layout from "../../components/contanct/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="min-h-screen px-6">
        {/* Judul halaman */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-gray-800">Dashboard</h1>
        </div>

        {/* Wrapper utama */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Kolom kiri (Card + Grafik + Heatmap) */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Baris Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                title="Aset Aktif"
                value={200}
                icon="/img/Assets.png"
                color="bg-accent"
              />
              <Card
                title="Aset Rusak"
                value={24}
                icon="/img/Risiko.png"
                color="bg-[#FFA0A0]"
              />
              <Card
                title="Nilai Aset"
                value="13M"
                icon="/img/Nilai.png"
                color="bg-[#8FED8E]"
              />
            </div>

            {/* Grafik & Heatmap */}
            <div className="grid grid-cols-1 gap-6 flex-1 lg:flex lg:gap-6">
              <div className="lg:flex-1">
                <TrendChart />
              </div>
              <div className="lg:flex-1">
                <TopRisk />
              </div>
            </div>
          </div>

          {/* Kolom kanan (Notifikasi tinggi penuh) */}
          <div className="lg:w-1/3 flex">
            <div className="bg-white rounded-xl shadow flex-1 flex flex-col">
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
