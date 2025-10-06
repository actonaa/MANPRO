export default function RiskHeatmap() {
  return (
    <div className="bg-white p-4 rounded-xl w-full shadow">
      <h3 className="text-sm font-semibold mb-2">Heatmap risiko</h3>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-6 bg-red-400 rounded"
            style={{ opacity: (i + 1) / 20 }}
          ></div>
        ))}
      </div>
    </div>
  );
}
