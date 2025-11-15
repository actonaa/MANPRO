/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ButtonText from "../../../components/button/ButtonText";
import InformasiUtama from "../../../components/kelola-asset/dinas/InformasiUtama";
import JadwalPemeliharaan from "../../../components/kelola-asset/dinas/JadwalPemeliharaan";
import KeterkaitanRisiko from "../../../components/kelola-asset/dinas/KeterkaitanRisiko";
import Lampiran from "../../../components/kelola-asset/dinas/Lampiran";
import RiwayatAktivitas from "../../../components/kelola-asset/dinas/RiwayatAktivitas";
import ScanBarcode from "../../../components/kelola-asset/dinas/ScanBarcode";
import SiklusHidup from "../../../components/kelola-asset/dinas/SiklusHidup";

export default function DetailAset() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/assets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok)
          throw new Error(`Gagal mengambil data aset (${res.status})`);

        const data = await res.json();
        setAsset(data);
      } catch (err) {
        console.error("❌ Gagal memuat data aset:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAsset();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-8 bg-gray-300 rounded w-64 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48" />
      </div>
    );
  }

  if (!asset) {
    return (
      <p className="text-red-500 p-6">
        Gagal memuat data aset atau tidak ditemukan.
      </p>
    );
  }

  // 🔹 Tentukan tambahan info berdasarkan kategori
  const isTI = asset.category?.name === "TI";
  const additionalInfo = isTI
    ? {
        version: asset.version || "-",
        os: asset.os || "-",
        ipAddress: asset.ip_address || "-",
        hostname: asset.hostname || "-",
        masaPakai: asset.masa_pakai || "-",
        url: asset.url || "-",
        tanggalDeploy: asset.tanggal_deploy
          ? new Date(asset.tanggal_deploy).toLocaleDateString("id-ID")
          : "-",
      }
    : {
        materialBahan: asset.material_bahan || "-",
        ukuranSpesifikasi: asset.ukuran_spesifikasi || "-",
        vendor: asset.vendor || "-",
        masaPakai: asset.masa_pakai || "-",
      };

  return (
    <div className="pb-10">
      {/* 🔹 Header Atas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Kelola Aset / Detail Aset
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-gray-700 mt-1">
            {asset.name}
          </p>
          <p className="text-sm text-gray-500">
            {asset.serial_number} • Terakhir diperbarui{" "}
            {new Date(asset.updated_at).toLocaleDateString("id-ID")}
          </p>
        </div>

        {/* 🔘 Tombol Aksi */}
        <div className="flex flex-row items-center justify-center gap-3">
          <a href="/insiden">
            <ButtonText
              title="Insiden"
              color="bg-white"
              hoverColor="hover:bg-gray-100"
              textColor="text-gray-700"
              fontWeight="font-medium"
            />
          </a>
          <a href={`/aset/tambah?id=${asset.id}`}>
            <ButtonText
              title="Ubah"
              color="bg-[#BFDEFF]"
              hoverColor="hover:bg-[#A5D4FF]"
              textColor="text-[#007BFF]"
              fontWeight="font-medium"
            />
          </a>
          <button>
            <ButtonText
              title="Hapus Aset"
              color="bg-[#FECACA]"
              hoverColor="hover:bg-[#FCA5A5]"
              textColor="text-[#991B1B]"
              fontWeight="font-medium"
            />
          </button>
        </div>
      </div>

      {/* 🔹 Layout Utama Dua Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <InformasiUtama
            merk={asset.merk_type || "-"}
            penanggungJawab={asset.pic || "-"}
            status={asset.status?.name || "-"}
            nomorSerial={asset.serial_number || "-"}
            kategori={asset.category?.name || "-"}
            subKategori={asset.sub_category?.name || "-"}
            nilaiAset={`Rp ${asset.acquisition_value?.toLocaleString("id-ID")}`}
            kodeBMD={asset.bmd_code || "-"}
            lokasi={asset.lokasi || "-"}
            tanggalPerolehan={
              asset.acquisition_date
                ? new Date(asset.acquisition_date).toLocaleDateString("id-ID")
                : "-"
            }
            kondisi={asset.condition?.name || "-"}
            {...additionalInfo} // ✅ Spread untuk TI / Non-TI
          />

          <SiklusHidup
            siklus={[
              { tahap: "Pengadaan", tanggal: asset.acquisition_date || "-" },
              { tahap: "Pemeliharaan Berkala", tanggal: "Belum tersedia" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5">
          <JadwalPemeliharaan jadwal={[]} />
          <KeterkaitanRisiko risiko={[]} />
          <RiwayatAktivitas aktivitas={[]} />
        </div>
      </div>

      {/* 🔹 Lampiran & Scan Barcode */}
      <div className="flex flex-col lg:flex-row gap-5 mt-6">
        <Lampiran lampiran={[]} />
        <ScanBarcode barcodeUrl={asset.barcode || ""} />
      </div>
    </div>
  );
}
