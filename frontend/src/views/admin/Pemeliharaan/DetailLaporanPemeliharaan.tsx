import HeaderPemeliharaan from "../../../components/pemeliharaan/dinas/HeaderPemeliharaan";
import InformasiUtama from "../../../components/kelola-asset/dinas/InformasiUtama";
import SiklusHidupCard from "../../../components/pemeliharaan/dinas/SiklusHidupCard";
import LampiranCard from "../../../components/pemeliharaan/dinas/LampiranCard";
import RiwayatAktivitasCard from "../../../components/pemeliharaan/dinas/RiwayatAktivitasCard";

export default function DetailPemeliharaanPage() {
  return (
    <>
      <div className=" space-y-6">
        {/* ✅ Header */}
        <HeaderPemeliharaan id="AST - 003" lastUpdate="10-12-2025" />

        {/* 📊 Dua kolom utama sejajar tinggi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 📍 Kolom Kiri */}
          <div className="flex flex-col gap-6 h-full">
            <InformasiUtama
              merk="ASUS Zenbook 247"
              penanggungJawab="Ahmad Syaifudin"
              status="Aktif"
              nomorSerial="091092010"
              kategori="TI"
              subKategori="Hardware"
              nilaiAset="Rp 10.000.000"
              kodeBMD="BMD12345"
              lokasi="Ruang TU"
              tanggalPerolehan="12-01-2025"
              kondisi="Rusak - Ringan"
              version=""
              os=""
              hostname=""
              ipAddress=""
            />
            <div className="flex-1 h-full">
              <LampiranCard />
            </div>
          </div>

          {/* 📍 Kolom Kanan */}
          <div className="flex flex-col gap-6">
            <SiklusHidupCard />
            <RiwayatAktivitasCard />
          </div>
        </div>
      </div>
    </>
  );
}
