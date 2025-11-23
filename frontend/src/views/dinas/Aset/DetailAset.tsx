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

import HapusAsetTahap1 from "../../../components/kelola-asset/dinas/HapusAsetTahap1";
import HapusAsetTahap2 from "../../../components/kelola-asset/dinas/HapusAsetTahap2";

export default function DetailAset() {
  const { id } = useParams<{ id: string }>();

  const [asset, setAsset] = useState<any>(null);
  const [risikoAset, setRisikoAset] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jadwalPemeliharaan, setJadwalPemeliharaan] = useState<
    { tanggal: string; kegiatan: string }[]
  >([]);
  const [lampiran, setLampiran] = useState<any[]>([]);
  const [tahap1, setTahap1] = useState(false);
  const [tahap2, setTahap2] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");

        const resAsset = await fetch(`/api/assets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAsset = await resAsset.json();
        setAsset(dataAsset);

        setLampiran(
          dataAsset.attachments
            ? [
                {
                  nama: dataAsset.attachments.split("/").pop() || "Lampiran",
                  url: dataAsset.attachments,
                },
              ]
            : []
        );

        const resRisk = await fetch(`/api/risks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataRisk = await resRisk.json();
        setRisikoAset(
          dataRisk.filter(
            (r: any) =>
              r.asset_id === dataAsset.id && r.approval_status === "approved"
          )
        );

        const resMaintenance = await fetch(`/api/maintenance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataMaintenance = await resMaintenance.json();

        setJadwalPemeliharaan(
          dataMaintenance
            .filter((m: any) => m.asset_id === dataAsset.id)
            .map((m: any) => ({
              tanggal: m.scheduled_date,
              kegiatan: m.notes || "-",
            }))
        );
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id]);

  // ======================================
  // HANDLE DELETE REQUEST
  // ======================================
  const handleDeleteAset = async () => {
    if (!deleteReason.trim()) {
      alert("Alasan penghapusan wajib diisi pada Tahap 1.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/assets/${asset.id}/request-delete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });

      if (!res.ok) throw new Error("Gagal mengajukan penghapusan aset");

      alert("Pengajuan hapus aset berhasil dikirim.");
      setTahap2(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus aset.");
    }
  };

  // ======================================
  // LOGIC: tidak boleh ubah & hapus
  // ======================================
  const tidakBolehEdit =
    asset?.status?.name === "Akan Dihapus" ||
    asset?.status?.name === "Proses Penghapusan";

  // ===============================
  // LOADING SKELETON
  // ===============================
  if (loading) {
    return (
      <div className="pb-10 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-8 bg-gray-300 rounded w-64 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48" />
      </div>
    );
  }

  if (!asset) return <p className="text-red-500 p-6">Aset tidak ditemukan.</p>;

  // ===============================
  // TI / NON TI
  // ===============================
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

  // ===============================
  // RENDER
  // ===============================
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
          {/* TOMBOL INSIDEN Tidak muncul jika aset akan dihapus */}
          {!tidakBolehEdit && (
            <a href="/insiden">
              <ButtonText
                title="Insiden"
                color="bg-white"
                hoverColor="hover:bg-gray-100"
                textColor="text-gray-700"
                fontWeight="font-medium"
              />
            </a>
          )}

          {/* TOMBOL UBAH Tidak muncul jika aset akan dihapus */}
          {!tidakBolehEdit && (
            <a href={`/aset/tambah?id=${asset.id}`}>
              <ButtonText
                title="Ubah"
                color="bg-[#BFDEFF]"
                hoverColor="hover:bg-[#A5D4FF]"
                textColor="text-[#007BFF]"
                fontWeight="font-medium"
              />
            </a>
          )}

          {/* TOMBOL HAPUS Tidak muncul jika aset akan dihapus */}
          {!tidakBolehEdit && (
            <button
              onClick={() => setTahap1(true)}
              className="bg-red-500 py-3 px-5 text-white rounded-[12px]"
            >
              Hapus Aset
            </button>
          )}
        </div>
      </div>

      {/* TWO COLUMN */}
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
          <KeterkaitanRisiko
            risiko={risikoAset}
            approvalStatus={asset.approval_status}
            assetId={asset.id}
          />
          <RiwayatAktivitas aktivitas={[]} />
        </div>
      </div>

      {/* LAMPIRAN & BARCODE */}
      <div className="flex flex-col lg:flex-row gap-5 mt-6">
        <div className="flex-1">
          <Lampiran lampiran={lampiran} />
        </div>
        <div className="flex-1">
          <ScanBarcode barcodeUrl={asset.barcode_qr_url || ""} />
        </div>
      </div>

      {/* ================================ */}
      {/* POPUP Tahap 1 & Tahap 2 DIPINDAHKAN */}
      {/* ================================ */}

      <HapusAsetTahap1
        open={tahap1}
        onClose={() => setTahap1(false)}
        onNext={() => {
          setTahap1(false);
          setTahap2(true);
        }}
        setReason={setDeleteReason}
        assetName={asset.name}
        kategori={asset.category?.name}
        merk={asset.tipe}
        subKategori={asset.sub_category?.name}
        serial={asset.serial_number}
        lokasi={asset.lokasi}
        tglPerolehan={asset.tgl_perolehan}
        penanggungJawab={asset.penanggung_jawab}
        kondisi={asset.kondisi}
        biaya={asset.biaya}
        kodeBMD={asset.bmd_code}
        namaDinas={asset.nama_dinas}
      />

      <HapusAsetTahap2
        open={tahap2}
        onClose={() => setTahap2(false)}
        onConfirm={handleDeleteAset}
        assetName={asset.name}
      />
    </div>
  );
}
