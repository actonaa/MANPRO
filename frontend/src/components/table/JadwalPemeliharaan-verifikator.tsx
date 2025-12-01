/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import PopupJadwalPemeliharaan from "../../components/form/verifikator/JadwalPemeliharaan";

type TablePemeliharaanProps = {
  selectedLevel?: string;
  selectedDate?: { start: string; end: string } | null;
};

type PemeliharaanItem = {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  prioritas: string;
  tanggal: string;
  risk_id?: string | null;
};

export default function TablePemeliharaanVerifikator({
  selectedLevel = "",
  selectedDate = null,
}: TablePemeliharaanProps) {
  const [data, setData] = useState<PemeliharaanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedAset, setSelectedAset] = useState<PemeliharaanItem | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // FETCH DATA — FIX CACHE + LOADING
  // =========================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token tidak ditemukan.");
        setLoading(false);
        return;
      }

      const ts = Date.now();

      const [maintenanceRes, assetsRes, risksRes] = await Promise.all([
        fetch(
          `https://asset-risk-management.vercel.app/api/maintenance?ts=${ts}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(`https://asset-risk-management.vercel.app/api/assets?ts=${ts}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://asset-risk-management.vercel.app/api/risks?ts=${ts}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [maintenanceJson, assetsJson, risksJson] = await Promise.all([
        maintenanceRes.json(),
        assetsRes.json(),
        risksRes.json(),
      ]);

      if (
        !Array.isArray(maintenanceJson) ||
        !Array.isArray(assetsJson) ||
        !Array.isArray(risksJson)
      ) {
        console.warn("Format API tidak sesuai");
        setLoading(false);
        return;
      }

      const assetsMap = assetsJson.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {});

      const riskMap = risksJson.reduce((acc: any, item: any) => {
        acc[item.asset_id] = item.id;
        return acc;
      }, {});

      const mappedData: PemeliharaanItem[] = maintenanceJson.map(
        (item: any) => {
          const asset = assetsMap[item.asset_id];

          return {
            id: item.id,
            nama: asset?.name || "Tidak diketahui",
            kategori: asset?.category?.name || "-",
            lokasi: asset?.lokasi || "-",
            prioritas:
              item.priority && item.priority !== "-"
                ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
                : "-",
            tanggal: item.scheduled_date || "-",
            risk_id: riskMap[item.asset_id] || null,
          };
        }
      );

      setData(mappedData);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // FILTER
  // =========================================
  const filteredData = data.filter((item) => {
    const matchLevel = selectedLevel
      ? item.prioritas.toLowerCase() === selectedLevel.toLowerCase()
      : true;

    const matchDate = selectedDate
      ? item.tanggal >= selectedDate.start && item.tanggal <= selectedDate.end
      : true;

    return matchLevel && matchDate;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevel, selectedDate]);

  // =========================================
  // BADGE COLOR
  // =========================================
  const getBadgeColor = (prioritas: string) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleJadwalkan = (item: PemeliharaanItem) => {
    setSelectedAset(item);
    setOpenPopup(true);
  };

  // =========================================
  // PUT UPDATE JADWAL
  // =========================================
  const handleSubmitJadwal = async (
    tanggal: string,
    priority: string,
    setPopupLoading: (state: boolean) => void
  ) => {
    if (!selectedAset) return;

    try {
      setPopupLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token hilang.");
        setPopupLoading(false);
        return;
      }

      const bodyPayload = {
        risk_id: selectedAset.risk_id,
        scheduled_date: tanggal,
        priority,
      };

      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/maintenance/${selectedAset.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        }
      );

      if (!res.ok) {
        console.error("PUT failed");
        setPopupLoading(false);
        return;
      }

      await fetchData();

      setPopupLoading(false);
      setOpenPopup(false);
    } catch (error) {
      console.error("Gagal update jadwal:", error);
      setPopupLoading(false);
    }
  };

  // =========================================
  // SKELETON UI (DESKTOP)
  // =========================================
  if (loading) {
    return (
      <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 lg:rounded-2xl">
        <div className="hidden xl:block">
          <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
            <thead className="text-[#666666]">
              <tr>
                <th className="py-5 px-4 font-semibold">ID ASET</th>
                <th className="py-5 px-4 font-semibold">NAMA ASET</th>
                <th className="py-5 px-4 font-semibold">KATEGORI</th>
                <th className="py-5 px-4 font-semibold">LOKASI</th>
                <th className="py-5 px-4 font-semibold">PRIORITAS</th>
                <th className="py-5 px-4 font-semibold">TANGGAL</th>
                <th className="py-5 px-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="py-5 px-4">
                      <div className="w-full h-4 rounded bg-gray-200 animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 shadow-sm bg-white">
              <div className="h-4 bg-gray-200 w-24 rounded mb-3 animate-pulse"></div>
              <div className="h-5 bg-gray-200 w-40 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 w-32 rounded mb-4 animate-pulse"></div>

              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((__, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================
  // UI NORMAL SETELAH LOADING
  // =========================================
  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 lg:rounded-2xl relative">
      {/* DESKTOP */}
      <div className="hidden xl:block">
        <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">PRIORITAS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.nama}</td>
                <td className="py-5 px-4">{item.kategori}</td>
                <td className="py-5 px-4">{item.lokasi}</td>

                <td className="py-5 px-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                      item.prioritas
                    )}`}
                  >
                    {item.prioritas}
                  </span>
                </td>

                <td className="py-5 px-4 text-gray-600">{item.tanggal}</td>

                <td className="py-5 px-4">
                  <button
                    className="hover:text-green-600"
                    onClick={() => handleJadwalkan(item)}
                  >
                    <CalendarDays size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {currentData.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">{item.tanggal}</p>
            <h3 className="text-base font-semibold">{item.nama}</h3>
            <p className="text-sm text-gray-500 mb-3">{item.lokasi}</p>

            <div className="grid grid-cols-2 text-sm gap-y-1">
              <p>
                <span className="font-medium">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium">Prioritas:</span>{" "}
                <span className={getBadgeColor(item.prioritas)}>
                  {item.prioritas}
                </span>
              </p>
              <p>
                <span className="font-medium">Kategori:</span> {item.kategori}
              </p>
              <p>
                <span className="font-medium">Tanggal:</span> {item.tanggal}
              </p>
            </div>

            <div className="flex justify-end mt-4 text-gray-500">
              <button
                className="hover:text-green-600"
                onClick={() => handleJadwalkan(item)}
              >
                <CalendarDays size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-6 px-1 text-sm text-gray-600">
        <p>
          Menampilkan {currentData.length} dari {totalItems} hasil
        </p>

        <div className="flex items-center gap-2 select-none">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 disabled:text-gray-400 hover:text-black"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 py-1 rounded ${
                currentPage === page
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 disabled:text-gray-400 hover:text-black"
          >
            &gt;
          </button>
        </div>

        <div></div>
      </div>

      <PopupJadwalPemeliharaan
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleSubmitJadwal}
      />
    </div>
  );
}
