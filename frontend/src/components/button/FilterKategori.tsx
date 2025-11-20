import FilterButtonBase from "./FilterButtonBase";

export default function FilterKategori({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Kategori"
      options={["Aset TI", "Aset Non TI"]}
      onSelect={onSelect}
    />
  );
}
