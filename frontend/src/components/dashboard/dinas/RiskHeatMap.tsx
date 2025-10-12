export default function RiskHeatmap() {
  // 📊 Data risiko dummy (bisa diganti dari API nanti)
  const risikoData = [
    { nama: "Risiko 1 : Data Breach", persen: 90, warna: "bg-red-600" },
    { nama: "Risiko 2 : Financial Fraud", persen: 85, warna: "bg-red-600" },
    { nama: "Risiko 3 : Equipment Failure", persen: 80, warna: "bg-red-600" },
    { nama: "Risiko 4 : Data Breach", persen: 70, warna: "bg-orange-400" },
    { nama: "Risiko 5 : Data Breach", persen: 65, warna: "bg-orange-400" },
    { nama: "Risiko 6 : Network Downtime", persen: 55, warna: "bg-green-400" },
    { nama: "Risiko 7 : Malware Attack", persen: 50, warna: "bg-green-400" },
    { nama: "Risiko 8 : Insider Threat", persen: 45, warna: "bg-green-400" },
    { nama: "Risiko 9 : Compliance Issue", persen: 40, warna: "bg-green-400" },
    { nama: "Risiko 10 : Human Error", persen: 35, warna: "bg-green-400" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg w-full h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Top 10 Risiko
      </h3>

      {/* ✅ Jarak diperkecil jadi space-y-2 */}
      <div className="space-y-2">
        {risikoData.map((item, idx) => (
          <div key={idx}>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {item.nama}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${item.warna} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${item.persen}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
