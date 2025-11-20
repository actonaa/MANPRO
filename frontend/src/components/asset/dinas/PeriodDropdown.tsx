export default function PeriodDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="date"
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-xl pl-3 pr-3 py-3 w-full bg-white text-gray-700 text-sm
                 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400
                 cursor-pointer transition-colors duration-200"
      placeholder="Pilih tanggal"
    />
  );
}
