/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InformasiUtama from "../../components/kelola-asset/dinas/InformasiUtama";
import JadwalPemeliharaan from "../../components/kelola-asset/dinas/JadwalPemeliharaan";
import KeterkaitanRisiko from "../../components/kelola-asset/dinas/KeterkaitanRisiko";
import Lampiran from "../../components/kelola-asset/dinas/Lampiran";
import RiwayatAktivitas from "../../components/kelola-asset/dinas/RiwayatAktivitas";
import ScanBarcode from "../../components/kelola-asset/dinas/ScanBarcode";
import SiklusHidup from "../../components/kelola-asset/dinas/SiklusHidup";
import LayoutDinas from "../layout/LayoutDinas";

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
  };

  return (
    <LayoutDinas>
      <div className="pb-10">
        {/* 🔙 Tombol Back + Judul */}
        <div
          className="flex items-center gap-2 mb-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Detail Aset
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 📄 Kolom kiri - Informasi Utama & Lampiran dalam 1 card tanpa shadow */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-lg p-6 w-full h-auto flex flex-col">
              {/* Informasi Utama */}
              <div className="mb-8">
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
                      ? new Date(asset.acquisition_date).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"
                  }
                  kondisi={asset.condition?.name || "-"}
                />
              </div>

              {/* 📎 Lampiran di bawah Informasi Utama */}
              <div className="pt-6 border-t border-gray-200 w-full">
                <Lampiran lampiran={[]} />
              </div>
            </div>

            {/* 📆 Card Siklus Hidup terpisah */}
            <SiklusHidup
              siklus={[
                { tahap: "Pengadaan", tanggal: asset.acquisition_date || "-" },
                { tahap: "Pemeliharaan Berkala", tanggal: "Belum tersedia" },
              ]}
            />
          </div>

          {/* 📊 Kolom kanan - Jadwal, Risiko, Riwayat */}
          <div className="flex flex-col gap-5">
            <JadwalPemeliharaan jadwal={[]} />
            <KeterkaitanRisiko risiko={[]} showAddButton={false} />
            <RiwayatAktivitas aktivitas={[]} />
          </div>
        </div>

        {/* 📷 Barcode */}
        <div className="mt-6">
          <ScanBarcode barcodeUrl={asset.barcode || ""} />
        </div>
      </div>
    </LayoutDinas>
  );
}
