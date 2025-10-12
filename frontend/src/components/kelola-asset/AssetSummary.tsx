export default function AssetSummary() {
  // 📊 Hardcode data (nanti bisa diganti ke API)
  const cards = [
    { title: "Total Aset", value: "1,250" },
    { title: "Aset Perlu Perbaikan", value: "560" },
    { title: "Aset Akan Dihapus", value: "200" },
    { title: "Total Nilai Aset", value: "RP. 2,5M" },
  ];

  return (
    <div className="flex overflow-x-auto space-x-3 snap-x snap-mandatory scroll-smooth scrollbar-hide gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl p-4 flex-shrink-0 w-[75%] flex flex-col justify-center transition-all duration-300 text-left snap-center shadow-[0_0_6px_rgba(0,0,0,0.1)]"
        >
          {/* Judul */}
          <p className="text-[17px] text-[#6B7280] font-medium -mt-2 -ml-2 ">
            {card.title}
          </p>

          {/* Nilai */}
          <h2 className="text-2xl font-bold mt-2 -ml-2 pb-6 text-gray-900">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
