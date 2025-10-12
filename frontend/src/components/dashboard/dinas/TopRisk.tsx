export default function TopRisk() {
  // Data risiko tertinggi
  const risks = [
    { name: "Kegagalan Server", value: 85, color: "bg-red-500" },
    { name: "Kebocoran Data", value: 72, color: "bg-orange-500" },
    { name: "Kesalahan Input", value: 60, color: "bg-yellow-400" },
    { name: "Gangguan Listrik", value: 45, color: "bg-green-500" },
    { name: "Keterlambatan Proyek", value: 35, color: "bg-blue-500" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        Top 5 Risiko Tertinggi
      </h3>

      <div className="flex flex-col gap-3">
        {risks.map((risk, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1 text-xs text-gray-600">
              <span>{risk.name}</span>
              <span>{risk.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${risk.color}`}
                style={{ width: `${risk.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
