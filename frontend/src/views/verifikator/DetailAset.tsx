/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InformasiUtama from "../../components/kelola-asset/dinas/InformasiUtama";
import JadwalPemeliharaan from "../../components/kelola-asset/dinas/JadwalPemeliharaan";
import KeterkaitanRisiko from "../../components/verifikator/KeterkaitanRisiko";
import Lampiran from "../../components/kelola-asset/dinas/Lampiran";
import RiwayatAktivitas from "../../components/kelola-asset/dinas/RiwayatAktivitas";
import ScanBarcode from "../../components/kelola-asset/dinas/ScanBarcode";
import SiklusHidup from "../../components/kelola-asset/dinas/SiklusHidup";

export default function DetailAset() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ Data dummy
  const asset = {
    id: id || "AST-001",
    name: "CCTV Lobby",
    serial_number: "SN-098273",
    updated_at: "2025-01-12",
    merk_type: "Hikvision 2MP",
    pic: "Dinas TI",
    status: { name: "Aktif" as "Aktif" | "Perbaikan" | "Tidak Aktif" },
    category: { name: "Infrastruktur" },
    sub_category: { name: "Keamanan" },
    acquisition_value: 3500000,
    bmd_code: "BMD-12345",
    lokasi: "Gedung Utama - Lantai 1",
    acquisition_date: "2024-06-14",
    condition: { name: "Baik" },
    barcode: "/assets/barcode-sample.png",
    hostname: "",
    ip_address: "",
    os: "",
    version: "",
  };

  return (
    <>
      {/* 🔹 Header Atas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* 🔙 Tombol Back + Info */}
        <div className="flex items-start gap-3">
          <ArrowLeft
            className="w-5 h-5 text-gray-700 mt-1 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Detail Aset
            </h1>
          </div>
        </div>
      </div>

      <div className="pb-10 p-5">
        {/* 🔹 Layout Utama Dua Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Kolom kiri */}
          <div className="flex flex-col gap-5">
            <InformasiUtama
              merk={asset.merk_type || "-"}
              penanggungJawab={asset.pic || "-"}
              status={asset.status?.name || "Aktif"}
              nomorSerial={asset.serial_number || "-"}
              kategori={asset.category?.name || "-"}
              subKategori={asset.sub_category?.name || "-"}
              nilaiAset={`Rp ${asset.acquisition_value?.toLocaleString(
                "id-ID"
              )}`}
              kodeBMD={asset.bmd_code || "-"}
              lokasi={asset.lokasi || "-"}
              tanggalPerolehan={
                asset.acquisition_date
                  ? new Date(asset.acquisition_date).toLocaleDateString("id-ID")
                  : "-"
              }
              kondisi={asset.condition?.name || "-"}
              hostname={asset.hostname}
              ipAddress={asset.ip_address}
              os={asset.os}
              version={asset.version}
            />

            <SiklusHidup
              siklus={[
                { tahap: "Pengadaan", tanggal: asset.acquisition_date || "-" },
                { tahap: "Pemeliharaan Berkala", tanggal: "Belum tersedia" },
              ]}
            />
          </div>

          {/* Kolom kanan */}
          <div className="flex flex-col gap-5">
            <JadwalPemeliharaan
              jadwal={[
                {
                  tanggal: "10-09-2025",
                  kegiatan: "Pengecekan rutin kamera CCTV",
                },
                {
                  tanggal: "15-10-2025",
                  kegiatan: "Pembersihan dan kalibrasi alat",
                },
              ]}
            />

            <KeterkaitanRisiko
              risiko={[
                {
                  kode: "RSK-001",
                  deskripsi: "Kerusakan modul kamera",
                  dampak: "Sedang",
                },
                {
                  kode: "RSK-002",
                  deskripsi: "Gangguan jaringan CCTV",
                  dampak: "Tinggi",
                },
              ]}
            />

            <RiwayatAktivitas
              aktivitas={[
                {
                  tanggal: "12-09-2025",
                  deskripsi: "Pemeliharaan preventif dilakukan oleh teknisi A",
                  status: "Selesai",
                },
                {
                  tanggal: "20-09-2025",
                  deskripsi: "Laporan kerusakan diterima dari user",
                  status: "Dalam Proses",
                },
              ]}
            />
          </div>
        </div>

        {/* 🔹 Lampiran & Barcode */}
        <div className="flex flex-col lg:flex-row gap-5 mt-6">
          <Lampiran lampiran={[]} />
          <ScanBarcode barcodeUrl={asset.barcode || ""} />
        </div>
      </div>
    </>
  );
}
