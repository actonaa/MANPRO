type CardListProps = {
  title: string;
  value: string;
};

export default function CardList({ title, value }: CardListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full">
      <h1 className="font-semibold text-[17px] lg:font-semibold lg:text-[14px] text-[#666] mb-2">
        {title}
      </h1>
      <p className="font-semibold text-[28px] lg:font-semibold lg:text-[28px]  mb-4">
        {value}
      </p>
    </div>
  );
}
