import FilterButtonBase from "./FilterButtonBase";

export default function FilterModul({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Pilih Modul"
      options={["Aset", "Risiko", "Users"]}
      onSelect={(v) => onSelect(v)}
    />
  );
}
