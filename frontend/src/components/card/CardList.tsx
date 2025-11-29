type CardListProps = {
  title: string;
  value: string;
  loading?: boolean; // untuk spinner
};

export default function CardList({ title, value, loading }: CardListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full flex flex-col">
      {/* Title */}
      <h1 className="font-semibold text-[17px] lg:text-[14px] text-[#666] mb-2">
        {title}
      </h1>

      {/* Value / Spinner */}
      {loading ? (
        <div className="flex justify-start items-center h-[32px]">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <p className="font-semibold text-[28px] lg:text-[28px] mb-4">{value}</p>
      )}
    </div>
  );
}
