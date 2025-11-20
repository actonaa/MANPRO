import CustomDropdown from "../../dropdown/CustomDropdown";

export default function ConditionDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "", label: "Semua" },
    { value: "Baik", label: "Baik" },
    { value: "Rusak Ringan", label: "Rusak Ringan" },
    { value: "Rusak Berat", label: "Rusak Berat" },
  ];
  return (
    <CustomDropdown
      placeholder="Pilih Kondisi"
      options={options}
      onChange={onChange}
    />
  );
}
