interface AssetCardsProps {
  total: number;
  perluPerbaikan: number;
  akanDihapus: number;
  totalNilai: string;
}

export default function AssetCards({
  total,
  perluPerbaikan,
  akanDihapus,
  totalNilai,
}: AssetCardsProps) {
  const cards = [
    { title: "Total Aset", value: total },
    { title: "Aset Perlu Perbaikan", value: perluPerbaikan },
    { title: "Aset Akan Dihapus", value: akanDihapus },
    { title: "Total Nilai Aset", value: totalNilai },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-center hover:shadow-md transition-all duration-300 w-full"
        >
          <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
          <h2 className="text-lg sm:text-2xl font-bold mt-1 text-gray-800">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
