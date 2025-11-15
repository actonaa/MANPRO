import FilterButtonBase from "./FilterButtonBase";

export default function FilterDinas({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  return (
    <FilterButtonBase
      label="Pilih Dinas"
      options={[
        "Dinas Pariwisata",
        "Dinas Pendidikan",
        "Dinas Komunikasi",
        "Diskominfo",
        "Dispendik",
        "Disbudpora",
      ]}
      onSelect={(v) => onSelect(v.toLowerCase())} // ✅ Kirim lowercase
    />
  );
}
