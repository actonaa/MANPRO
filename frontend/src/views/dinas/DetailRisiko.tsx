import LayoutDinas from "../layout/LayoutDinas";
import RisikoHeader from "../../components/risiko/dinas/RisikoHeader";
import RisikoDetailCard from "../../components/risiko/dinas/RisikoDetailCard";
import RencanaMitigasiCard from "../../components/risiko/dinas/RencanaMitigasiCard";
import RiwayatAktivitasCard from "../../components/risiko/dinas/RiwayatAktivitasCard";
import ButtonCard from "../../components/button/Button";
import ValueRisiko from "../../components/risiko/dinas/ValueRisiko";

export default function RisikoPage() {
  return (
    <LayoutDinas>
      {/* 🔥 Header + Tombol Edit sejajar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <RisikoHeader />
        <div className="w-full md:w-auto">
          <ButtonCard
            title="Edit Detail Risiko"
            color="#007DFA"
            hoverColor="#0066cc"
            textColor="#ffffff"
            borderColor="#007DFA"
            justify="justify-center"
            fontWeight="font-semibold"
            onClick={() => console.log("Tombol Edit diklik!")}
          />
        </div>
      </div>
      {/* 🧩 Card utama */}
      <div className="mt-5">
        <div className="bg-white rounded-2xl space-y-6">
          {/* 📊 Detail Risiko */}
          <RisikoDetailCard />

          {/* 🔧 Layout 2 kolom untuk Mitigasi & Value */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* 📁 Kiri: Rencana Mitigasi */}
            <RencanaMitigasiCard />

            {/* 📁 Kanan: Value Risiko + Riwayat Aktivitas */}
            <div className="space-y-6">
              <ValueRisiko />
              <RiwayatAktivitasCard />
            </div>
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}
