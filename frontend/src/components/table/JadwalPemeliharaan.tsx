import { useEffect, useState } from "react";

interface Props {
  selectedKategori?: string;
  selectedPrioritas?: string;
  searchQuery?: string;
}

interface MaintenanceItem {
  id: string;
  asset_id: string;
  type: string;
  scheduled_date: string;
  completion_date: string | null;
  vendor: string;
  cost: number;
  notes: string;
  proof: string | null;
  created_by: string | null;
  asset?: {
    name: string;
    lokasi: string;
  };
  kategori?: string;
  prioritas?: string;
  risk_id?: string; // pastikan backend menyediakan risk_id
}

export default function TableJadwalPemeliharaan({
  selectedKategori,
  selectedPrioritas,
  searchQuery,
}: Props) {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        // 1️⃣ Fetch maintenance
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const maintenances: MaintenanceItem[] = await res.json();

        // 2️⃣ Enrich data: kategori dari asset, prioritas dari risk
        const enrichedData = await Promise.all(
          maintenances.map(async (item) => {
            // Ambil data asset
            const assetRes = await fetch(
              `https://asset-risk-management.vercel.app/api/assets/${item.asset_id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const assetData = await assetRes.json();
            const kategori = assetData.category?.name || "Tidak ada";
            const asset = {
              name: assetData.name,
              lokasi: assetData.lokasi,
            };

            // Ambil data prioritas dari risk_id (pastikan backend menyediakan risk_id)
            let prioritas = "Rendah"; // default
            if (item.risk_id) {
              try {
                const riskRes = await fetch(
                  `https://asset-risk-management.vercel.app/api/risks/${item.risk_id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const riskData = await riskRes.json();
                prioritas = riskData.priority || riskData.criteria || "Rendah";
              } catch (err) {
                console.warn("Gagal fetch prioritas:", err);
              }
            }

            return { ...item, asset, kategori, prioritas };
          })
        );

        setData(enrichedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      (!selectedKategori || item.kategori === selectedKategori) &&
      (!selectedPrioritas || item.prioritas === selectedPrioritas) &&
      (!searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.kategori?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false))
  );

  const getBadgeColor = (prioritas: string) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Memuat data...</p>;

  return (
    <div className="mt-5 bg-white md:mt-0">
      {/* TABLE VIEW */}
      <div className="overflow-x-auto hidden lg:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">PRIORITAS</th>
              <th className="py-5 px-4 font-semibold">JADWAL PEMELIHARAAN</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-b-[#ddd] hover:bg-gray-50"
                >
                  <td className="py-5 px-4 text-[#333] lg:text-[13px]">
                    {item.id}
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[13px]">
                    {item.asset?.name}
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[13px]">
                    {item.kategori}
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[13px]">
                    {item.asset?.lokasi}
                  </td>
                  <td className="py-5 px-4">
                    <span
                      className={`px-5 md:px-7 py-2 rounded-[16px] text-[13px] font-normal ${getBadgeColor(
                        item.prioritas || "Rendah"
                      )}`}
                    >
                      {item.prioritas || "Rendah"}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[13px]">
                    {item.scheduled_date}
                  </td>
                  <td className="py-5 px-4">
                    <a
                      href={`/pemeliharaan/${item.id}`}
                      className="text-[#0095E8] font-medium lg:text-[13px] hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-5 text-center text-gray-500 italic"
                >
                  Tidak ada jadwal pemeliharaan tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-6 flex justify-between p-4">
          <p className="text-[13px] text-[#6B7280]">
            Menampilkan {filteredData.length} hasil
          </p>
        </div>
      </div>

      {/* CARD VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500">{item.id}</p>
                <a
                  href={`/pemeliharaan/detail/${item.id}`}
                  className="text-[#0095E8] text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>
              <h3 className="font-semibold border-b pb-2 border-gray-300 text-gray-800 text-[15px] mb-3">
                {item.asset?.name}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-700">{item.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="text-gray-700">{item.asset?.lokasi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Prioritas</span>
                  <span
                    className={`px-3 py-[2px] text-xs rounded-full font-medium ${getBadgeColor(
                      item.prioritas || "Rendah"
                    )}`}
                  >
                    {item.prioritas || "Rendah"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jadwal</span>
                  <span className="text-gray-700">{item.scheduled_date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada jadwal pemeliharaan tersedia.
          </p>
        )}
      </div>
    </div>
  );
}
