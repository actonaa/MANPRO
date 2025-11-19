import FilterButtonBase from "./FilterButtonBase";

export default function FilterStatus({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Pilih Status"
      options={["Aktif", "Perbaikan", "Tidak Aktif"]}
      onSelect={(v) => onSelect(v.toLowerCase())}
    />
  );
}
