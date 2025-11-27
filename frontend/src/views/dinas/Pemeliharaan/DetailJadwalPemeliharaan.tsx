/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AgendaPemeliharaanCard from "../../../components/pemeliharaan/dinas/AgendaPemeliharaanCard";
import InfoPemeliharaan from "../../../components/pemeliharaan/dinas/InfoPemeliharaan";

export default function LaptopKerjaDetail() {
  const { id: maintenance_id } = useParams();

  const [maintenance, setMaintenance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // ==============================
  // 1️⃣ FETCH MAINTENANCE DETAIL
  // ==============================
  const fetchMaintenance = async () => {
    try {
      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/maintenance/${maintenance_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();
      const selected = Array.isArray(json) ? json[0] : json;

      setMaintenance(selected);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetchMaintenance:", error);
      setLoading(false);
    }
  };

  // ==============================
  // CEK HARI H
  // ==============================
  const shouldShowAgenda = () => {
    if (!maintenance?.scheduled_date) return false;

    // Jangan tampilkan jika sudah selesai
    if (maintenance?.completion_date) return false;

    const today = new Date().toISOString().split("T")[0];
    const scheduled = maintenance.scheduled_date.split("T")[0];

    // Hari H dan setelahnya
    return today >= scheduled;
  };

  if (loading)
    return (
      <div className="animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="h-32 bg-gray-200 rounded-xl mb-5"></div>
        <div className="h-48 bg-gray-200 rounded-xl mb-5"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );

  const asset = maintenance?.asset;

  // ==============================
  //  🟦 KATEGORI DIGANTI NAMA RISIKO
  // ==============================
  const namaRisiko = maintenance?.risk?.title ?? "Tidak ada";

  const prioritas = maintenance?.priority ?? "Tidak ada";

  return (
    <>
      <div className="text-sm text-gray-600 mb-4">
        Pemeliharaan / Jadwal Pemeliharaan /{" "}
        <span className="text-gray-900">Detail Jadwal Pemeliharaan</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {asset?.name ?? "Nama Aset Tidak Ditemukan"}
      </h1>

      {/* ===========================
          INFO PEMELIHARAAN
      ============================ */}
      <div className="mb-5">
        <InfoPemeliharaan
          idJadwal={maintenance?.id}
          idAset={maintenance?.asset_id}
          namaAset={asset?.name}
          namaRisiko={namaRisiko}
          lokasi={asset?.lokasi}
          prioritas={prioritas}
          tanggal={maintenance?.scheduled_date}
          status={maintenance?.completion_date ? "Selesai" : "Pemeliharaan"}
        />
      </div>

      {/* ===========================
          DETAIL MAINTENANCE
      ============================ */}
      {(maintenance?.type ||
        maintenance?.vendor ||
        maintenance?.notes ||
        maintenance?.cost ||
        maintenance?.completion_date) && (
        <div className="bg-white rounded-xl mb-5 border border-gray-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipe Pemeliharaan */}
            {maintenance?.type && (
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Tipe Pemeliharaan
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {maintenance.type}
                </div>
              </div>
            )}

            {/* Deskripsi */}
            {maintenance?.notes && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
                <div className="text-base text-gray-900">
                  {maintenance.notes}
                </div>
              </div>
            )}

            {/* Biaya */}
            {maintenance?.cost && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Biaya</div>
                <div className="text-base font-semibold text-gray-900">
                  Rp {maintenance.cost.toLocaleString("id-ID")}
                </div>
              </div>
            )}

            {/* Vendor */}
            {maintenance?.vendor && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Vendor</div>
                <div className="text-base font-semibold text-gray-900">
                  {maintenance.vendor}
                </div>
              </div>
            )}

            {/* Tanggal Selesai */}
            {maintenance?.completion_date && (
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Tanggal Selesai
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {new Date(maintenance.completion_date).toLocaleDateString(
                    "id-ID"
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===========================
          HARI-H ONLY
      ============================ */}
      {shouldShowAgenda() && (
        <AgendaPemeliharaanCard maintenanceId={maintenance?.id} />
      )}
    </>
  );
}
