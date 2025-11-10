import CustomDropdown from "../../dropdown/CustomDropdown";

export default function StatusAuditDropdown({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "UPDATE", label: "UPDATE" },
    { value: "CREATE", label: "CREATE" },
    { value: "DELETE", label: "DELETE" },
  ];

  return (
    <CustomDropdown
      placeholder="Pilih Status"
      options={options}
      onChange={onChange}
    />
  );
}
