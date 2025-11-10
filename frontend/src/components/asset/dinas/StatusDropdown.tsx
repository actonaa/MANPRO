import CustomDropdown from "../../dropdown/CustomDropdown";

export default function StatusDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "Aktif", label: "Aktif" },
    { value: "Perbaikan", label: "Perbaikan" },
    { value: "Tidak Aktif", label: "Tidak Aktif" },
  ];
  return (
    <CustomDropdown
      placeholder="Pilih Status"
      options={options}
      onChange={onChange}
    />
  );
}
