export default function SummaryCards() {
  // 📊 Hardcode data (nanti bisa diganti ke API)
  const cards = [
    { title: "Total Aset", value: "1,250" },
    { title: "Aset Perlu Perbaikan", value: "560" },
    { title: "Aset Akan Dihapus", value: "200" },
    { title: "Risiko Aktif", value: "499" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm p-4 flex flex-col justify-center hover:shadow-md transition-all duration-300 w-full text-center sm:text-left"
        >
          {/* Judul */}
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {card.title}
          </p>

          {/* Nilai */}
          <h2 className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
