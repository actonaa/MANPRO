/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import InformasiUtama from "../../../components/kelola-asset/dinas/InformasiUtama";
import LampiranCard from "../../../components/pemeliharaan/dinas/LampiranCard";
import RiwayatAktivitasCard from "../../../components/pemeliharaan/verifikator/RiwayatAktivitas";
import DeskripsiPemeliharaan from "../../../components/pemeliharaan/verifikator/DeskripsiPemeliharaan";
import InfoPemeliharaan from "../../../components/pemeliharaan/verifikator/InfoPemeliharaan";

export default function DetailPemeliharaanPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState<any>(null);
  const [asset, setAsset] = useState<any>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMaintenanceAndAsset = async () => {
      try {
        // GET DETAIL MAINTENANCE
        const resMaintenance = await fetch(
          `https://asset-risk-management.vercel.app/api/maintenance/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const maintenanceData = await resMaintenance.json();
        setMaintenance(maintenanceData);

        // GET DETAIL ASSET
        const resAsset = await fetch(
          `https://asset-risk-management.vercel.app/api/assets/${maintenanceData.asset_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const assetData = await resAsset.json();
        setAsset(assetData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceAndAsset();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Header */}
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

      <div className="p-6 space-y-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Kiri Atas — Informasi Utama */}
    <div className="col-span-1 row-span-2">
      <InformasiUtama
        merk={asset?.merk_type}
        penanggungJawab={asset?.pic}
        status={asset?.status?.name}
        nomorSerial={asset?.serial_number}
        kategori={asset?.category?.name}
        subKategori={asset?.sub_category?.name}
        masaPakai={asset?.useful_life}
        vendor={asset?.vendor}
        nilaiAset={asset?.acquisition_value?.toLocaleString("id-ID")}
        kodeBMD={asset?.bmd_code}
        lokasi={asset?.lokasi}
        tanggalPerolehan={asset?.acquisition_date}
        kondisi={asset?.condition?.name}
        os={asset?.os}
        version={asset?.version}
        hostname={asset?.hostname}
        ipAddress={asset?.ip_address}
      />
    </div>

    {/* Kanan Atas — Riwayat Aktivitas */}
    <div>
      <RiwayatAktivitasCard maintenance={maintenance} />
    </div>

    {/* Kanan Tengah — Lampiran */}
    <div>
      <LampiranCard
        lampiranAset={asset?.attachments}
        lampiranPemeliharaan={maintenance?.proof}
      />
    </div>

    {/* Kiri Bawah — Info Pemeliharaan */}
    <div>
      <InfoPemeliharaan
        tipePemeliharaan={maintenance?.type}
        biaya={`Rp. ${maintenance?.cost?.toLocaleString("id-ID")}`}
        vendor={maintenance?.vendor}
      />
    </div>

    {/* Kanan Bawah — Deskripsi */}
    <div>
      <DeskripsiPemeliharaan
        deskripsi={maintenance?.notes || "Tidak ada catatan pemeliharaan."}
      />
    </div>

  </div>
</div>

    </>
  );
}
