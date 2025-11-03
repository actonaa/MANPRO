import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InformasiUtama from "../../components/kelola-asset/dinas/InformasiUtama";
import SiklusHidupCard from "../../components/pemeliharaan/dinas/SiklusHidupCard";
import LampiranCard from "../../components/pemeliharaan/dinas/LampiranCard";
import RiwayatAktivitasCard from "../../components/pemeliharaan/dinas/RiwayatAktivitasCard";
import DeskripsiPemeliharaan from "../../components/pemeliharaan/verifikator/DeskripsiPemeliharaan";
import InfoPemeliharaan from "../../components/pemeliharaan/verifikator/InfoPemeliharaan";

export default function DetailPemeliharaanPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="p-6 space-y-6">
        {/* 🔹 Header Utama */}
        <div className="flex items-start gap-3 mb-4">
          <ArrowLeft
            className="w-5 h-5 text-gray-700 mt-1 cursor-pointer hover:text-gray-900 transition"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Detail Laporan Pemeliharaan
            </h1>
          </div>
        </div>

        {/* 📊 Dua kolom utama */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 📍 Kolom Kiri */}
          <div className="flex flex-col gap-6 h-full">
            {/* Informasi utama */}
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
              kondisi="Baik - Ringan"
              os=""
              version=""
              hostname=""
              ipAddress=""
            />

            {/* 🧾 LampiranCard (diperkecil secara vertikal tanpa crop) */}
            <div className="scale-y-90">
              <LampiranCard />
            </div>

            {/* Info Pemeliharaan */}
            <InfoPemeliharaan
              tipePemeliharaan="Terjadwal"
              biaya="Rp. 112.000.000"
              vendor="Princess Hami"
            />
          </div>

          {/* 📍 Kolom Kanan */}
          <div className="flex flex-col gap-5">
            <SiklusHidupCard />
            <RiwayatAktivitasCard />
            <DeskripsiPemeliharaan deskripsi="Ini adalah catatan atau deskripsi dari detail jadwal pemeliharaan." />
          </div>
        </div>
      </div>
    </>
  );
}
