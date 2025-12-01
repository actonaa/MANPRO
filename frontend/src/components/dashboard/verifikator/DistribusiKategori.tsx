import { useEffect, useState } from "react";

type Asset = {
  acquisition_value: number;
  sub_category?: {
    name: string;
  };
};

export default function DistribusiKategori() {
  const [data, setData] = useState<{ kategori: string; total: number }[]>([]);
  const [totalAcquisition, setTotalAcquisition] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/assets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const assets: Asset[] = await res.json();

      // --- GROUP BY SUB CATEGORY ---
      const grouped: Record<string, { count: number; highestValue: number }> =
        {};

      assets.forEach((item) => {
        // ❗ Skip jika tidak ada sub_category
        if (!item.sub_category?.name) return;

        const sub = item.sub_category.name;
        const val = item.acquisition_value || 0;

        if (!grouped[sub]) {
          grouped[sub] = {
            count: 1,
            highestValue: val,
          };
        } else {
          grouped[sub].count += 1;
          if (val > grouped[sub].highestValue) {
            grouped[sub].highestValue = val;
          }
        }
      });

      // Convert ke array
      const hasil = Object.entries(grouped).map(([kategori, obj]) => ({
        kategori,
        total: obj.count,
      }));

      // Ambil top 5
      const topFive = hasil.sort((a, b) => b.total - a.total).slice(0, 5);

      // Total nilai menggunakan highestValue tiap kategori
      const totalValue = Object.values(grouped).reduce(
        (acc, item) => acc + item.highestValue,
        0
      );

      setData(topFive);
      setTotalAcquisition(totalValue);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSemua = data.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
      <h2 className="text-lg lg:text-[22px] font-semibold text-gray-800 mb-4">
        Distribusi Aset Per-Sub Kategori
      </h2>

      <div className="md:border md:border-[#ddd] md:p-4 md:rounded-xl">
        {loading ? (
          <div className="w-full flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((item) => {
              const persen =
                totalSemua === 0 ? 0 : (item.total / totalSemua) * 100;

              return (
                <div key={item.kategori}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">
                      {item.kategori}
                    </p>
                    <p className="text-sm text-gray-500">{item.total}</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${persen}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-t-[#ddd] mt-5 pt-3 flex justify-between text-sm font-semibold text-[#333]">
          <span>Total Nilai Aset</span>
          <span>
            Rp{" "}
            {totalAcquisition.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
