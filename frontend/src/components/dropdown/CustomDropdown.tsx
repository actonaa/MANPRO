type Option = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  placeholder: string;
  options: Option[];
  onChange?: (value: string) => void;
};

export default function CustomDropdown({
  placeholder,
  options,
  onChange,
}: CustomDropdownProps) {
  return (
    <select
      className="border border-gray-400 rounded-md pl-3 pr-12 py-1.5 w-full bg-white text-gray-700 text-sm
                 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400
                 cursor-pointer transition-colors duration-200 appearance-none"
      defaultValue=""
      onChange={(e) => onChange && onChange(e.target.value)}
      style={{
        backgroundColor: "white",
        backgroundImage:
          'url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNmI3MjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcgMTBsNSA1IDUtNXoiLz48L3N2Zz4=")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.7rem center", // panah agak ke kanan
        backgroundSize: "1rem",
        paddingRight: "2.8rem", // ruang tambahan biar teks gak nabrak
        height: "36px", // kecil elegan
      }}
    >
      <option value="" disabled className="text-gray-400">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-white text-gray-700 hover:bg-blue-100"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}
