export default function LevelDropdown({ onChange }: { onChange: (val: string) => void }) {
  return (
    <select
      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Semua Level</option>
      <option value="Tinggi">Tinggi</option>
      <option value="Sedang">Sedang</option>
      <option value="Rendah">Rendah</option>
    </select>
  );
}
