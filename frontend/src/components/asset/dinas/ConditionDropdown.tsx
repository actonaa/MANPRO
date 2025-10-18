import CustomDropdown from "../../dropdown/CustomDropdown";

export default function ConditionDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "BAIK", label: "BAIK" },
    { value: "RUSAK - RINGAN", label: "RUSAK - RINGAN" },
    { value: "RUSAK - BERAT", label: "RUSAK - BERAT" },
  ];
  return (
    <CustomDropdown
      placeholder="Pilih Kondisi"
      options={options}
      onChange={onChange}
    />
  );
}
