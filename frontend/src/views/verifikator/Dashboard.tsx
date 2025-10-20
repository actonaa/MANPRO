import CardList from "../../components/card/CardList";
import LayoutDinas from "../layout/LayoutDinas";
import DistribusiKategori from "../../components/dashboard/verifikator/DistribusiKategori";
import StatusJadwalPemeliharaan from "../../components/dashboard/verifikator/StatusJadwalPemeliharaan";
import VerifikasiTertunda from "../../components/dashboard/verifikator/VerifikasiTertunda";

export default function Dashboard() {
  return (
    <LayoutDinas>
      <h1 className="font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>

      {/* 📊 Card Ringkasan */}
      <div className="mb-5 overflow-x-auto pb-6 md:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList title="Aset Aktif" value="120" />
          <CardList title="Aset Belum Di Verifikasi" value="34" />
          <CardList title="Jadwal Pemeliharaan Minggu ini" value="12" />
          <CardList title="Risiko Prioritas Tinggi" value="21" />
        </div>
      </div>

      {/* 📋 Verifikasi Tertunda */}
      <div className="mb-6">
        <VerifikasiTertunda />
      </div>

      {/* 📊 Distribusi & Status Jadwal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 📊 Distribusi Aset Per-Kategori */}
        <div className="lg:col-span-1 w-full">
          <DistribusiKategori />
        </div>

        {/* 📊 Status Jadwal Pemeliharaan */}
        <div className="lg:col-span-1 w-full">
          <StatusJadwalPemeliharaan />
        </div>
      </div>
    </LayoutDinas>
  );
}
