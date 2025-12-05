/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import InformasiUtama from "../../components/kelola-asset/dinas/InformasiUtama";
import JadwalPemeliharaan from "../../components/kelola-asset/dinas/JadwalPemeliharaan";
import KeterkaitanRisiko from "../../components/verifikator/KeterkaitanRisiko";
import Lampiran from "../../components/kelola-asset/dinas/Lampiran";
import RiwayatAktivitas from "../../components/kelola-asset/dinas/RiwayatAktivitas";
import ScanBarcode from "../../components/kelola-asset/dinas/ScanBarcode";
import SiklusHidup from "../../components/kelola-asset/dinas/SiklusHidup";

interface AktivitasItem {
  tanggal: string;
  kegiatan: string;
  status: string;
}

export default function DetailAset() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [asset, setAsset] = useState<any>(null);
  const [risikoAset, setRisikoAset] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jadwalPemeliharaan, setJadwalPemeliharaan] = useState<
    { tanggal: string; kegiatan: string }[]
  >([]);
  const [lampiran, setLampiran] = useState<any[]>([]);
  const [riwayatAktivitas, setRiwayatAktivitas] = useState<
    AktivitasItem[] | null
  >(null);

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

        // 🔹 Format Lampiran
        const lampiranFormatted = dataAsset.attachments
          ? [
              {
                nama: dataAsset.attachments.split("/").pop() || "Lampiran",
                url: dataAsset.attachments,
              },
            ]
          : [];
        setLampiran(lampiranFormatted);

        // 🔹 Fetch RISKS
        const resRisk = await fetch(`/api/risks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const dataRisk = await resRisk.json();
        const filteredRisks = dataRisk.filter(
          (r: any) =>
            r.asset_id === dataAsset.id && r.approval_status === "approved"
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

        // Filter dan format jadwal pemeliharaan
        const filteredMaintenance = dataMaintenance
          .filter((m: any) => m.asset_id === dataAsset.id)
          .map((m: any) => ({
            tanggal: m.scheduled_date,
            kegiatan: m.notes || "-",
          }));
        setJadwalPemeliharaan(filteredMaintenance);

        // 🔹 Set Riwayat Aktivitas dari maintenance
        const aktivitasFormatted: AktivitasItem[] = dataMaintenance
          .filter((m: any) => m.asset_id === dataAsset.id)
          .map((m: any) => ({
            tanggal: m.scheduled_date,
            kegiatan: m.notes || "-",
            status: m.status || "-",
          }));
        setRiwayatAktivitas(aktivitasFormatted);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id]);

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

  const isTI = asset?.category?.name === "TI";

  const additionalInfo = isTI
    ? {
        version: asset?.version || "-",
        os: asset?.os || "-",
        ipAddress: asset?.ip_address || "-",
        hostname: asset?.hostname || "-",
        masaPakai: asset?.useful_life || "-",
        url: asset?.url || "-",
        tanggalDeploy: asset?.deploy_date
          ? new Date(asset.deploy_date).toLocaleDateString("id-ID")
          : "-",
        indukAset: asset?.parent_name || "-",
      }
    : {
        materialBahan: asset?.material || "-",
        ukuranSpesifikasi: asset?.specification || "-",
        vendor: asset?.vendor || "-",
        masaPakai: asset?.useful_life || "-",
      };

  if (loading) {
    return (
      <div className="pb-10 p-6 animate-pulse">
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

  return (
    <div className="pb-10">
      <div
        className="flex flex-row items-center gap-2 text-lg py-5 cursor-pointer"
        onClick={() => navigate("/aset-verifikator")}
      >
        <ArrowLeft className="text-xs" />
        <p>Detail Aset</p>
      </div>

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
              { tahap: "Pengadaan", tanggal: formatTanggal(asset.acquisition_date) },
              { tahap: "Pemeliharaan Berkala", tanggal: pemeliharaanDate },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5">
          <JadwalPemeliharaan jadwal={jadwalPemeliharaan} />
          <KeterkaitanRisiko
            risiko={risikoAset}
            approvalStatus={asset.approval_status}
            assetId={asset.id}
          />
          <RiwayatAktivitas act={riwayatAktivitas} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 mt-6">
        <div className="flex-1">
          <Lampiran lampiran={lampiran} />
        </div>
        <div className="flex-1">
          <ScanBarcode barcodeUrl={asset.barcode_qr_url || ""} />
        </div>
      </div>
    </div>
  );
}
