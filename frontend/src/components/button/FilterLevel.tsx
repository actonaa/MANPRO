import FilterButtonBase from "./FilterButtonBase";

export default function FilterLevel({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Pilih Level"
      options={["Tinggi", "Sedang", "Rendah"]}
      onSelect={(v) => onSelect(v.toLowerCase())}
    />
  );
}
