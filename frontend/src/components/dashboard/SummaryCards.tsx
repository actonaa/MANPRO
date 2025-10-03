import AssetsIcon from "../../img/dashboard/Assets.png";
import RisikoIcon from "../../img/dashboard/Risiko.png";
import NilaiIcon from "../../img/dashboard/Nilai.png";

export default function SummaryCards() {
  const cards = [
    {
      title: "Aset aktif",
      value: "200",
      icon: AssetsIcon,
      bg: "bg-blue-200",
    },
    {
      title: "Aset rusak",
      value: "24",
      icon: RisikoIcon,
      bg: "bg-red-200",
    },
    {
      title: "Nilai aset",
      value: "13m",
      icon: NilaiIcon,
      bg: "bg-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
      {cards.map((card) => (
        <div
          key={card.title}
          className="p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-sm bg-white flex justify-between items-center hover:shadow-md transition-all duration-300 w-full h-20 sm:h-24"
        >
          {/* kiri */}
          <div>
            <p className="text-[10px] sm:text-sm text-gray-600">{card.title}</p>
            <h2 className="text-base sm:text-2xl font-bold mt-1">
              {card.value}
            </h2>
          </div>

          {/* kanan (ikon responsif dari gambar) */}
          <div
            className={`p-1 sm:p-2 rounded-md sm:rounded-lg ${card.bg} flex items-center justify-center`}
          >
            <img
              src={card.icon}
              alt={card.title}
              className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
