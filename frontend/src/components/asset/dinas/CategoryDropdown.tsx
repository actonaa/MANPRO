import CustomDropdown from "../../dropdown/CustomDropdown";

export default function CategoryDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "", label: "Semua" },
    { value: "TI", label: "TI" },
    { value: "Non-TI", label: "Non-TI" },
  ];
  return (
    <CustomDropdown
      placeholder="Pilih Kategori"
      options={options}
      onChange={onChange}
    />
  );
}
