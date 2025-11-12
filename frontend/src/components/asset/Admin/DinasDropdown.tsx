export default function DinasDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "Dinas Kesehatan", label: "DINAS KESEHATAN" },
    { value: "Dinas Pendidikan", label: "DINAS PENDIDIKAN" },
    { value: "Dinas Pekerjaan Umum", label: "DINAS PEKERJAAN UMUM" },
    { value: "Dinas Perhubungan", label: "DINAS PERHUBUNGAN" },
    { value: "Dinas Sosial", label: "DINAS SOSIAL" },
  ];

  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      defaultValue=""
    >
      <option value="" disabled>
        Pilih Dinas
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
