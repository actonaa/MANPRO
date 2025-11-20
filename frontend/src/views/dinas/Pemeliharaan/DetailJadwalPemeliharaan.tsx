/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AgendaPemeliharaanCard from "../../../components/pemeliharaan/dinas/AgendaPemeliharaanCard";
import InfoPemeliharaan from "../../../components/pemeliharaan/dinas/InfoPemeliharaan";

export default function LaptopKerjaDetail() {
  const [data, setData] = useState<any>(null);
  const [kategori, setKategori] = useState<string>("-");
  const [prioritas, setPrioritas] = useState<string>("Tidak ada");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Ambil MAINTENANCE
      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/maintenance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      const maintenance = json[0];
      setData(maintenance);

      // 2. Ambil ASSET (agar kategori muncul!)
      const assetRes = await fetch(
        `https://asset-risk-management.vercel.app/api/assets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const assetJson = await assetRes.json();

      const assetDetail = assetJson.find(
        (a: any) => a.id === maintenance.asset_id
      );

      setKategori(assetDetail?.category?.name ?? "-");

      // 3. Ambil RISKS
      const riskRes = await fetch(
        "https://asset-risk-management.vercel.app/api/risks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const riskJson = await riskRes.json();

      const risikoAset = riskJson.find(
        (r: any) => r.asset_id === maintenance.asset_id
      );

      setPrioritas(risikoAset?.priority ?? "Tidak ada");

      setLoading(false);
    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  };

  const isHariH = () => {
    const today = new Date().toISOString().split("T")[0];
    const scheduled = data.scheduled_date?.split("T")[0];
    return today === scheduled;
  };

  if (loading)
    return (
      <div className="animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="mb-4">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
        </div>

        {/* InfoPemeliharaan Skeleton */}
        <div className="mb-5 bg-white border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Kolom 1 */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>

            {/* Kolom 2 */}
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-28 bg-gray-300 rounded"></div>
            </div>

            {/* Kolom 3 */}
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
            </div>

            {/* Kolom 4 */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-28 bg-gray-300 rounded"></div>
            </div>

            {/* Kolom 5 */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>

            {/* Kolom 6 */}
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Detail Card Skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
            {/* Tipe */}
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-full bg-gray-300 rounded mb-2"></div>
              <div className="h-5 w-2/3 bg-gray-300 rounded"></div>
            </div>

            {/* Vendor */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Agenda Card Skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Pemeliharaan / Jadwal Pemeliharaan /{" "}
        <span className="text-gray-900">Detail Jadwal Pemeliharaan</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {data.asset?.name}
      </h1>

      <div className="mb-5">
        <InfoPemeliharaan
          idJadwal={data.id}
          idAset={data.asset_id}
          namaAset={data.asset?.name}
          kategori={kategori}
          lokasi={data.asset?.lokasi}
          prioritas={prioritas}
          tanggal={data.scheduled_date}
          status={data.completion_date ? "Selesai" : "Mendatang"}
        />
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-xl mb-5 border border-gray-100 lg:p-5">
        <div className="grid grid-cols-1 pt-5 md:grid-cols-3 lg:grid-cols-1 gap-6">
          {/* Tipe Pemeliharaan */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Tipe Pemeliharaan</div>
            <div className="text-base font-semibold text-gray-900">
              {data.type}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
            <div className="text-base text-gray-900">
              {data.notes || "Tidak ada deskripsi"}
            </div>
          </div>

          {/* Vendor */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Vendor</div>
            <div className="text-base font-semibold text-gray-900">
              {data.vendor}
            </div>
          </div>
        </div>
      </div>

      {/* Agenda */}
      {isHariH() && (
        <div>
          <AgendaPemeliharaanCard />
        </div>
      )}
    </>
  );
}
