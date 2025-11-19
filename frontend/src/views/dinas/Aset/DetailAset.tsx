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
  const [risikoAset, setRisikoAset] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jadwalPemeliharaan, setJadwalPemeliharaan] = useState<
    { tanggal: string; kegiatan: string }[]
  >([]);

  // bagian useEffect
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔹 Fetch ASSET
        const resAsset = await fetch(`/api/assets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!resAsset.ok)
          throw new Error(`Gagal mengambil data aset (${resAsset.status})`);
        const dataAsset = await resAsset.json();
        setAsset(dataAsset);

        // 🔹 Fetch RISKS
        const resRisk = await fetch(`/api/risks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const dataRisk = await resRisk.json();
        const filteredRisks = dataRisk.filter(
          (r: any) => r.asset_id === dataAsset.id
        );
        setRisikoAset(filteredRisks);

        // 🔹 Fetch MAINTENANCE
        const resMaintenance = await fetch(`/api/maintenance`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const dataMaintenance = await resMaintenance.json();

        // Filter berdasarkan asset_id
        const filteredMaintenance = dataMaintenance
          .filter((m: any) => m.asset_id === dataAsset.id)
          .map((m: any) => ({
            tanggal: m.scheduled_date,
            kegiatan: m.notes || "-",
          }));

        setJadwalPemeliharaan(filteredMaintenance);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id]);

  // =======================
  // LOADING
  // =======================
  if (loading) {
    return (
      <div className="pb-10 p-6 animate-pulse">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-8 bg-gray-300 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-48" />
          </div>
          <div className="flex flex-row items-center justify-center gap-3 mt-4 md:mt-0">
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-28 bg-gray-200 rounded" />
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Informasi Utama */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>

            {/* Siklus Hidup */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Jadwal Pemeliharaan */}
            <div className="h-24 bg-gray-200 rounded" />

            {/* Risiko */}
            <div className="h-32 bg-gray-200 rounded" />

            {/* Riwayat Aktivitas */}
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>

        {/* LAMPIRAN & BARCODE */}
        <div className="flex flex-col lg:flex-row gap-5 mt-6">
          <div className="flex-1 h-48 bg-gray-200 rounded" />
          <div className="flex-1 h-48 bg-gray-200 rounded" />
        </div>
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

  // =======================
  // ADDITIONAL INFO (TI / Non-TI)
  // =======================
  const isTI = asset.category?.name === "TI";

  const additionalInfo = isTI
    ? {
        version: asset.version || "-",
        os: asset.os || "-",
        ipAddress: asset.ip_address || "-",
        hostname: asset.hostname || "-",
        masaPakai: asset.useful_life || "-",
        url: asset.url || "-",
        tanggalDeploy: asset.deploy_date
          ? new Date(asset.deploy_date).toLocaleDateString("id-ID")
          : "-",
        indukAset: asset.parent_name || "-",
      }
    : {
        materialBahan: asset.material || "-",
        ukuranSpesifikasi: asset.specification || "-",
        vendor: asset.vendor || "-",
        masaPakai: asset.useful_life || "-",
      };

  const formatTanggal = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const pemeliharaanDate =
    jadwalPemeliharaan.length > 0
      ? formatTanggal(jadwalPemeliharaan[0].tanggal)
      : "Belum tersedia";

  // =======================
  // RENDER
  // =======================
  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Kelola Aset / Detail Aset
          </h1>

          <div className="flex items-center gap-2">
            <p className="text-2xl md:text-3xl font-medium text-gray-700 mt-1">
              {asset.name}
            </p>
            {asset.parent?.name && (
              <span className="text-2xl md:text-3xl font-medium text-gray-700 mt-1">
                - {asset.parent.name}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {asset.id} - Terakhir diperbarui{" "}
            {new Date(asset.updated_at).toLocaleDateString("id-ID")}
          </p>
        </div>

        {/* ACTION BUTTONS */}
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

      {/* TWO COLUMN LAYOUT */}
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
            {...additionalInfo}
            indukAset={asset.parent?.name || "-"}
          />

          <SiklusHidup
            siklus={[
              {
                tahap: "Pengadaan",
                tanggal: formatTanggal(asset.acquisition_date) || "-",
              },
              { tahap: "Pemeliharaan Berkala", tanggal: pemeliharaanDate },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5">
          <JadwalPemeliharaan jadwal={jadwalPemeliharaan} />

          {/* 🔥 Risiko hasil filter */}
          <KeterkaitanRisiko
            risiko={risikoAset}
            approvalStatus={asset.approval_status}
          />

          <RiwayatAktivitas aktivitas={[]} />
        </div>
      </div>

      {/* LAMPIRAN & BARCODE */}
      <div className="flex flex-col lg:flex-row gap-5 mt-6">
        <div className="flex-1">
          <Lampiran lampiran={[]} />
        </div>
        <div className="flex-1">
          <ScanBarcode barcodeUrl={asset.barcode_qr_url || ""} />
        </div>
      </div>
    </div>
  );
}
