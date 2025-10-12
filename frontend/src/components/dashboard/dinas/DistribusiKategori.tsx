export default function DistribusiKategori() {
  // 📊 Data dummy (nanti bisa diganti dari API)
  const data = [
    { kategori: "Komputer", total: 120 },
    { kategori: "Server", total: 95 },
    { kategori: "Infrastruktur", total: 80 },
    { kategori: "Kendaraan", total: 60 },
    { kategori: "Perangkat Lunak", total: 30 },
  ];

  // Hitung total semua untuk persentase bar
  const totalSemua = data.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full h-full">
      <h2 className="text-lg lg:text-[22px] font-semibold text-gray-800 mb-4">
        Distribusi Aset Per-Kategori
      </h2>
      <div className="md:border md:border-[#ddd] md:p-4 md:rounded-xl">
        <div className="space-y-5">
          {data.map((item) => {
            const persen = (item.total / totalSemua) * 100;
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
          <span>Rp 21,4M</span>
        </div>
      </div>
    </div>
  );
}
