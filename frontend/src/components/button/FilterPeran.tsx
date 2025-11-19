import FilterButtonBase from "./FilterButtonBase";

export default function FilterPeran({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Pilih Peran"
      options={["Administrator", "Verifikator", "User Dinas"]}
      onSelect={(v) => onSelect(v)}
    />
  );
}
