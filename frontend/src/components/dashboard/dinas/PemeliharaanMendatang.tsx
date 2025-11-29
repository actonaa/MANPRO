import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface MaintenanceAsset {
  name: string;
}

interface MaintenanceItem {
  id: string;
  scheduled_date: string;
  status: string;
  asset: MaintenanceAsset;
}

export default function PemeliharaanMendatang() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<MaintenanceItem[]>(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 📌 Filter:
        // 1. Hanya status "dijadwalkan"
        // 2. scheduled_date harus > hari ini (bukan tanggal lewat)
        const upcoming = res.data.filter((item) => {
          const scheduleDate = new Date(item.scheduled_date);
          scheduleDate.setHours(0, 0, 0, 0);

          return (
            item.status === "dijadwalkan" &&
            scheduleDate.getTime() > today.getTime()
          );
        });

        setItems(upcoming);
      } catch (err) {
        console.error("Gagal fetch maintenance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  const formatTanggal = (dateStr: string) => {
    const tanggal = new Date(dateStr);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
        <h2 className="text-lg lg:text-[22px] font-semibold text-black mb-4">
          Pemeliharaan Mendatang
        </h2>
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const maxDisplay = items.slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
      <h2 className="text-lg lg:text-[22px] font-semibold text-black mb-4">
        Pemeliharaan Mendatang
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Tidak ada jadwal pemeliharaan mendatang.
        </p>
      ) : (
        <div className="space-y-2">
          {maxDisplay.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/pemeliharaan/${item.id}`)}
              className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3 hover:bg-blue-100 transition cursor-pointer"
            >
              <div className="flex flex-col md:flex-row-reverse md:justify-around md:p-4 md:gap-20">
                {/* Nama Asset */}
                <p className="text-blue-800 md:text-black font-medium md:font-semibold text-sm">
                  {item.asset?.name ?? "Tidak ada nama aset"}
                </p>

                {/* Tanggal */}
                <p className="text-blue-500 md:text-black text-xs mt-0.5 md:mt-0 md:font-semibold md:text-sm">
                  {formatTanggal(item.scheduled_date)}
                </p>
              </div>

              {/* Panah (hanya HP) */}
              <ChevronRight className="text-blue-500 w-4 h-4 block md:hidden" />
            </div>
          ))}
        </div>
      )}

      {/* Tombol lihat lebih banyak */}
      {items.length > 3 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/pemeliharaan")}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Lihat pemeliharaan lebih banyak →
          </button>
        </div>
      )}
    </div>
  );
}
