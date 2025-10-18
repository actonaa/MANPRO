import CustomDropdown from "../../dropdown/CustomDropdown";

export default function StatusDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "Diterima", label: "DITERIMA" },
    { value: "Tertunda", label: "TERTUNDA" },
    { value: "Ditolak", label: "DITOLAK" },
  ];
  return (
    <CustomDropdown
      placeholder="Pilih Status"
      options={options}
      onChange={onChange}
    />
  );
}
