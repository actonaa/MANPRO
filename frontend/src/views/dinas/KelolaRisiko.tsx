import LayoutDinas from "../layout/LayoutDinas";
import RisikoResidual from "../../components/kelola-risiko/dinas/RisikoResidual";
import HeatmapRisiko from "../../components/kelola-risiko/dinas/HeatmapRisiko";
import Top10Risiko from "../../components/kelola-risiko/dinas/Top10Resiko";
import ButtonText from "../../components/button/ButtonText";

export default function KelolaAset() {
  // ✅ Data sementara dari backend (dummy)
  const totalRisiko = {
    rendah: 46,
    sedang: 30,
    tinggi: 10,
  };

  // ✅ Data matriks sementara (Probabilitas × Dampak)
  const matrixData = [
    [5, 10, 15, 20, 25],
    [4, 8, 12, 16, 20],
    [3, 6, 9, 12, 15],
    [2, 4, 6, 8, 10],
    [1, 2, 3, 4, 5],
  ];

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
      <div className="space-y-10">
        {/* 📊 Risiko Residual */}
        <RisikoResidual
          rendah={totalRisiko.rendah}
          sedang={totalRisiko.sedang}
          tinggi={totalRisiko.tinggi}
        />

        {/* 🔥 Heatmap Risiko */}
        <HeatmapRisiko data={matrixData} />

        {/* 📉 Risiko Progress Bar */}
        <Top10Risiko data={risikoList} />

        {/* 🔵 Tombol navigasi */}
        <div className="flex justify-center pt-4">
          <ButtonText
            title="Lihat Daftar Risiko"
            onClick={handleLihatRisiko}
            color="bg-[#007DFA]" // 🔵 warna biru
            hoverColor="hover:bg-[#0069D5]" // 🔵 warna hover
            textColor="text-white"
            fontWeight="font-semibold"
          />
        </div>
      </div>
    </LayoutDinas>
  );
}
