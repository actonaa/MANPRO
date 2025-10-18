import LayoutDinas from "../layout/LayoutDinas";
import HeaderPemeliharaan from "../../components/pemeliharaan/dinas/HeaderPemeliharaan";
import InformasiUtamaCard from "../../components/pemeliharaan/dinas/InformasiUtamaCard";
import SiklusHidupCard from "../../components/pemeliharaan/dinas/SiklusHidupCard";
import LampiranCard from "../../components/pemeliharaan/dinas/LampiranCard";
import RiwayatAktivitasCard from "../../components/pemeliharaan/dinas/RiwayatAktivitasCard";
import AgendaPemeliharaanCard from "../../components/pemeliharaan/dinas/AgendaPemeliharaanCard";

export default function DetailPemeliharaanPage() {
  return (
    <LayoutDinas>
      <div className="p-6 space-y-6">
        {/* ✅ Header */}
        <HeaderPemeliharaan id="AST - 003" lastUpdate="10-12-2025" />

        {/* 📊 Dua kolom utama sejajar tinggi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 📍 Kolom Kiri */}
          <div className="flex flex-col gap-6 h-full">
            <InformasiUtamaCard />
            <div className="flex-1 h-full">
              <LampiranCard />
            </div>
          </div>

          {/* 📍 Kolom Kanan */}
          <div className="flex flex-col gap-6 h-full">
            <SiklusHidupCard />
            <RiwayatAktivitasCard />
            <div className="flex-1">
              <AgendaPemeliharaanCard />
            </div>
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}
