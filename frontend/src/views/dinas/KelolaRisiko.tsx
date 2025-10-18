import LayoutDinas from "../layout/LayoutDinas";
import RisikoResidual from "../../components/kelola-risiko/dinas/RisikoResidual";
import Top10Risiko from "../../components/kelola-risiko/dinas/Top10Resiko";
import ButtonText from "../../components/button/ButtonText";
import CardList from "../../components/card/CardList";

export default function KelolaAset() {
  // ✅ Data sementara dari backend (dummy)
  const totalRisiko = {
    rendah: 46,
    sedang: 30,
    tinggi: 10,
  };

  // ✅ Data risiko dummy
  const risikoList = [
    { id: 1, nama: "Data breach", nilai: 95, kategori: "tinggi" },
    { id: 2, nama: "Financial Fraud", nilai: 90, kategori: "tinggi" },
    { id: 3, nama: "Equipment Failure", nilai: 88, kategori: "tinggi" },
    { id: 4, nama: "Unauthorized Access", nilai: 75, kategori: "sedang" },
    { id: 5, nama: "Service Downtime", nilai: 70, kategori: "sedang-rendah" },
    { id: 6, nama: "Configuration Error", nilai: 68, kategori: "menengah" },
    { id: 7, nama: "Policy Violation", nilai: 65, kategori: "menengah" },
    { id: 8, nama: "Network Latency", nilai: 60, kategori: "sedang-rendah" },
    { id: 9, nama: "Data Corruption", nilai: 55, kategori: "menengah" },
    { id: 10, nama: "Backup Failure", nilai: 45, kategori: "rendah" },
  ];

  // 📍 Fungsi klik tombol
  const handleLihatRisiko = () => {
    window.location.href = "/daftar-risiko";
  };

  return (
    <LayoutDinas>
      {/* 🔵 Tombol navigasi */}
      <div className="flex justify-end pt-4 pb-2">
        <ButtonText
          title="Lihat Daftar Risiko"
          onClick={handleLihatRisiko}
          color="bg-[#007DFA]" // 🔵 warna biru
          hoverColor="hover:bg-[#0069D5]" // 🔵 warna hover
          textColor="text-white"
          fontWeight="font-semibold"
        />
      </div>
      <div className="mb-5 overflow-x-auto pb-6 md:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList title="Total Risiko" value="56" />
          <CardList title="Risiko Tinggi" value="10" />
          <CardList title="Risiko Sedang" value="17" />
          <CardList title="Risiko Rendah" value="20" />
          <CardList title="Tindakan Mitigasi" value="11" />
        </div>
      </div>
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row mt-6">
          {/* 📊 Risiko Residual */}
          <div className="flex-1 rounded-2xl p-2 ">
            <RisikoResidual
              rendah={totalRisiko.rendah}
              sedang={totalRisiko.sedang}
              tinggi={totalRisiko.tinggi}
            />
          </div>

          {/* 🔥 Heatmap Risiko */}
          <div className="flex-2 rounded-2xl shadow-lg p-5">
            <img
              src="/kelola-risiko/Heatmap.png"
              alt="Heatmap Risiko"
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>

        {/* 📉 Risiko Progress Bar */}
        <Top10Risiko data={risikoList} />
      </div>
    </LayoutDinas>
  );
}
