import FilterButtonBase from "./FilterButtonBase";

export default function FilterKondisi({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Pilih Kondisi"
      options={["BAIK", "RUSAK - RINGAN", "RUSAK - BERAT"]}
      onSelect={(v) => onSelect(v.toLowerCase())}
    />
  );
}
