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
  prioritas?: string | null;
  risk_id?: string;
}

export default function TableJadwalPemeliharaan({
  selectedKategori,
  selectedPrioritas,
  searchQuery,
}: Props) {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // PAGINATION
  // ------------------------------
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // ------------------------------
  // FETCH DATA
  // ------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const maintenances: MaintenanceItem[] = await res.json();

        const enrichedData = await Promise.all(
          maintenances.map(async (item) => {
            let kategori = "Tidak ada";
            let asset = { name: "-", lokasi: "-" };
            let prioritas: string | null = null;

            try {
              const assetRes = await fetch(
                `https://asset-risk-management.vercel.app/api/assets/${item.asset_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const assetData = await assetRes.json();
              kategori = assetData?.category?.name ?? "Tidak ada";
              asset = {
                name: assetData?.name ?? "-",
                lokasi: assetData?.lokasi ?? "-",
              };
            } catch (error) {
              console.error("Terjadi kesalahan:", error);
            }

            if (item.risk_id) {
              try {
                const riskRes = await fetch(
                  `https://asset-risk-management.vercel.app/api/risks/${item.risk_id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const riskData = await riskRes.json();
                prioritas = riskData?.priority ?? riskData?.criteria ?? null;
              } catch (error) {
                console.error("Terjadi kesalahan:", error);
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

  // ------------------------------
  // FILTERING
  // ------------------------------
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

  // ------------------------------
  // PAGINATION CALC
  // ------------------------------
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page jika filter berubah tetapi page > totalPages
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, filteredData.length, totalPages]);

  // ------------------------------
  // BADGE COLORS
  // ------------------------------
  const getBadgeColor = (prioritas?: string | null) => {
    if (!prioritas) return "bg-gray-100 text-gray-600";
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

  // ------------------------------
  // LOADING SKELETON
  // ------------------------------
  if (loading)
    return (
      <div className="mt-5 bg-white md:mt-0 space-y-4">
        {/* TABLE SKELETON */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
            <thead>
              <tr>
                {Array.from({ length: 7 }).map((_, idx) => (
                  <th key={idx} className="py-5 px-4 font-semibold">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="border-b border-b-[#ddd]">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <td key={i} className="py-5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-xl shadow-sm space-y-3"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // ------------------------------
  // RENDER
  // ------------------------------
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-b-[#ddd] hover:bg-gray-50"
                >
                  <td className="py-5 px-4">{item.id}</td>
                  <td className="py-5 px-4">{item.asset?.name}</td>
                  <td className="py-5 px-4">{item.kategori}</td>
                  <td className="py-5 px-4">{item.asset?.lokasi}</td>
                  <td className="py-5 px-4">
                    <span
                      className={`px-5 py-2 rounded-[16px] text-[13px] ${getBadgeColor(
                        item.prioritas
                      )}`}
                    >
                      {item.prioritas ?? "Tidak ada"}
                    </span>
                  </td>
                  <td className="py-5 px-4">{item.scheduled_date}</td>
                  <td className="py-5 px-4">
                    <a
                      href={`/pemeliharaan/${item.asset_id}`}
                      className="text-[#0095E8] font-medium hover:underline"
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

        {/* PAGINATION */}
        <div className="mt-6 flex flex-col md:flex-row md:justify-between items-center gap-4 p-4">
          <p className="text-[13px] text-[#6B7280]">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -
            {` ${Math.min(currentPage * itemsPerPage, filteredData.length)}`}{" "}
            dari {filteredData.length} hasil
          </p>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 text-gray-600 disabled:text-gray-300"
            >
              ‹
            </button>

            {/* Number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? "bg-gray-200 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-gray-600 disabled:text-gray-300"
            >
              ›
            </button>
          </div>

          <div></div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {paginatedData.length > 0 ? (
          paginatedData.map((item, index) => (
            <div key={index} className="border p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm">{item.id}</p>
                <a
                  href={`/pemeliharaan/${item.asset_id}`}
                  className="text-blue-500 text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>
              <h3 className="font-semibold border-b pb-2 mb-3">
                {item.asset?.name}
              </h3>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Kategori</span>
                  <span>{item.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lokasi</span>
                  <span>{item.asset?.lokasi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Prioritas</span>
                  <span
                    className={`px-3 py-[2px] text-xs rounded-full ${getBadgeColor(
                      item.prioritas
                    )}`}
                  >
                    {item.prioritas ?? "Tidak ada"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jadwal</span>
                  <span>{item.scheduled_date}</span>
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

      {/* PAGINATION MOBILE */}
      <div className="mt-6 flex justify-center items-center gap-2 lg:hidden">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-gray-600 disabled:text-gray-300"
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === page
                ? "bg-gray-200 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-gray-600 disabled:text-gray-300"
        >
          ›
        </button>
      </div>
    </div>
  );
}
