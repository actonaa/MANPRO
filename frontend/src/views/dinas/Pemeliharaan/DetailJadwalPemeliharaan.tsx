/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AgendaPemeliharaanCard from "../../../components/pemeliharaan/dinas/AgendaPemeliharaanCard";
import InfoPemeliharaan from "../../../components/pemeliharaan/dinas/InfoPemeliharaan";

export default function LaptopKerjaDetail() {
  const { asset_id } = useParams();

  const [maintenance, setMaintenance] = useState<any>(null);
  const [assetDetail, setAssetDetail] = useState<any>(null);
  const [prioritas, setPrioritas] = useState<string>("Tidak ada");
  const [kategori, setKategori] = useState<string>("-");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("🚀 useEffect triggered | asset_id =", asset_id);
    fetchAll();
  }, []);

  // ==============================
  // FETCH ALL
  // ==============================
  const fetchAll = async () => {
    try {
      await Promise.all([fetchMaintenance(), fetchAssets(), fetchRisks()]);

      setLoading(false);
    } catch (error) {
      console.error("❌ ERROR FETCH ALL:", error);
      setLoading(false);
    }
  };

  // ==============================
  // 1️⃣ FETCH MAINTENANCE DETAIL
  // ==============================
  const fetchMaintenance = async () => {
    try {
      console.log("🔄 Fetching maintenance...");

      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/maintenance/${asset_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();
      console.log("📦 Maintenance JSON:", json);

      const selected = Array.isArray(json) ? json[0] : json;

      console.log("📌 Selected Maintenance:", selected);

      setMaintenance(selected);
    } catch (error) {
      console.error("❌ Error fetchMaintenance:", error);
    }
  };

  // ==============================
  // 2️⃣ FETCH ASSET DETAIL
  // (sesuai struktur JSON yang kamu kirim)
  // ==============================
  const fetchAssets = async () => {
    try {
      console.log("🔄 Fetching assets list...");

      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/assets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();

      console.log("📦 Asset JSON LIST:", json);

      if (!Array.isArray(json)) {
        console.error("❌ Asset API tidak mengembalikan array:", json);
        return;
      }

      // Cari asset by ID
      const selected = json.find(
        (item: any) => String(item.id) === String(asset_id)
      );

      console.log("📌 Selected Asset Detail:", selected);

      if (!selected) {
        console.warn("⚠ Asset tidak ditemukan untuk ID:", asset_id);
      }

      setAssetDetail(selected);

      // Ambil kategori dari nested object → sesuai JSON kamu
      setKategori(selected?.category?.name ?? "-");
    } catch (error) {
      console.error("❌ Error fetchAssets:", error);
    }
  };

  // ==============================
  // 3️⃣ FETCH RISK BY asset_id
  // ==============================
  const fetchRisks = async () => {
    try {
      console.log("🔄 Fetching risks...");

      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/risks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();

      console.log("📦 Risk JSON LIST:", json);

      const risk = json.find(
        (r: any) => String(r.asset_id) === String(asset_id)
      );

      console.log("📌 Selected Risk:", risk);

      setPrioritas(risk?.priority ?? "Tidak ada");
    } catch (error) {
      console.error("❌ Error fetchRisks:", error);
    }
  };

  // ==============================
  // CEK HARI H
  // ==============================
  const isHariH = () => {
    if (!maintenance?.scheduled_date) return false;

    const today = new Date().toISOString().split("T")[0];
    const scheduled = maintenance.scheduled_date.split("T")[0];

    console.log("📆 Today:", today, "| Scheduled:", scheduled);

    return today === scheduled;
  };

  // ==============================
  // LOADING
  // ==============================
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

  // ==============================
  // UI
  // ==============================
  return (
    <>
      <div className="text-sm text-gray-600 mb-4">
        Pemeliharaan / Jadwal Pemeliharaan /{" "}
        <span className="text-gray-900">Detail Jadwal Pemeliharaan</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {assetDetail?.name ?? "Nama Aset Tidak Ditemukan"}
      </h1>

      <div className="mb-5">
        <InfoPemeliharaan
          idJadwal={maintenance?.id}
          idAset={maintenance?.asset_id}
          namaAset={assetDetail?.name}
          kategori={kategori}
          lokasi={assetDetail?.lokasi}
          prioritas={prioritas}
          tanggal={maintenance?.scheduled_date}
          status={maintenance?.completion_date ? "Selesai" : "Mendatang"}
        />
      </div>

      {(maintenance?.type || maintenance?.vendor || maintenance?.notes) && (
        <div className="bg-white rounded-xl mb-5 border border-gray-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
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

            {maintenance?.notes && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
                <div className="text-base text-gray-900">
                  {maintenance.notes}
                </div>
              </div>
            )}

            {maintenance?.vendor && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Vendor</div>
                <div className="text-base font-semibold text-gray-900">
                  {maintenance.vendor}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isHariH() && <AgendaPemeliharaanCard />}
    </>
  );
}
