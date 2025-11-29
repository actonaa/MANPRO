import { useEffect, useState } from "react";
import axios from "axios";

interface Asset {
  acquisition_value?: number;
  sub_category?: {
    name?: string;
  };
}

export default function DistribusiKategori() {
  const [kategoriData, setKategoriData] = useState<
    { kategori: string; total: number }[]
  >([]);
  const [totalNilaiAset, setTotalNilaiAset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAset = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<Asset[]>(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const assets = res.data;

        const totalValue = assets.reduce(
          (acc, item) => acc + (item.acquisition_value ?? 0),
          0
        );
        setTotalNilaiAset(totalValue);

        const map: Record<string, number> = {};

        assets.forEach((item) => {
          const name = item.sub_category?.name || "Lainnya";

          if (!map[name]) map[name] = 0;
          map[name] += 1;
        });

        let hasil = Object.entries(map).map(([kategori, total]) => ({
          kategori,
          total,
        }));

        hasil = hasil.sort((a, b) => b.total - a.total).slice(0, 5);

        setKategoriData(hasil);
      } catch (error) {
        console.error("Gagal fetch distribusi kategori:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAset();
  }, []);

  const totalSemua = kategoriData.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
      <h2 className="text-lg lg:text-lg font-semibold text-gray-800 mb-4">
        Distribusi Aset Per Sub-Kategori (Top 5)
      </h2>

      {loading ? (
        // 🔵 SPINNER LOADING
        <div className="w-full flex justify-center py-10">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      ) : (
        <div className="md:border md:border-[#ddd] md:p-4 md:rounded-xl">
          <div className="space-y-5">
            {kategoriData.map((item) => {
              const persen =
                totalSemua > 0 ? (item.total / totalSemua) * 100 : 0;

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

          <div className="border-t border-t-[#ddd] mt-5 pt-3 flex justify-between text-sm font-semibold text-[#333]">
            <span>Total Nilai Aset</span>
            <span>
              Rp{" "}
              {totalNilaiAset.toLocaleString("id-ID", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
