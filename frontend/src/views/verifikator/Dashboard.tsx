import CardList from "../../components/card/CardList";
import LayoutDinas from "../layout/LayoutDinas";
import DistribusiKategori from "../../../components/dashboard/verifikator/DistribusiKategori";
import StatusJadwalPemeliharaan from "../../../components/dashboard/verifikator/StatusJadwalPemeliharaan";
import VerifikasiTertunda from "../../../components/dashboard/verifikator/VerifikasiTertunda";

export default function Dashboard() {
  return (
    <LayoutDinas>
      {/* 🧭 Judul */}
      <h1 className="font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>

      {/* 📊 Card Ringkasan */}
      <div className="mb-5">
        <div
          className="
            grid grid-cols-2 gap-4
            sm:grid-cols-2 md:grid-cols-4
          "
        >
          {/* 🔹 Urutan sesuai gambar */}
          <CardList title="Aset Aktif" value="120" />
          <CardList title="Jadwal Pemeliharaan Minggu ini" value="12" />
          <CardList title="Aset Belum Di Verifikasi" value="34" />
          <CardList title="Risiko Prioritas Tinggi" value="21" />
        </div>
      </div>

      {/* 📋 Verifikasi Tertunda */}
      <div className="mb-6">
        <VerifikasiTertunda />
      </div>

      {/* 📊 Distribusi & Status Jadwal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1 w-full">
          <DistribusiKategori />
        </div>

        <div className="lg:col-span-1 w-full">
          <StatusJadwalPemeliharaan />
        </div>
      </div>
    </LayoutDinas>
  );
}
