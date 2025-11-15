import FilterButtonBase from "./FilterButtonBase";

export default function FilterStatus({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Status"
      options={["Aktif", "Perbaikan", "Tidak Aktif"]}
      onSelect={onSelect}
    />
  );
}
