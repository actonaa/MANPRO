type CardListProps = {
  title: string;
  value: string;
};

export default function CardList({ title, value }: CardListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full">
      <h1 className="font-semibold text-[17px] text-[#666666] mb-2">{title}</h1>
      <p className="font-bold text-[28px] mb-4">{value}</p>
    </div>
  );
}
