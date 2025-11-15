import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search",
  onChange,
}: {
  placeholder?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-2 w-full 
      border border-gray-300 rounded-2xl px-4 py-3 bg-white"
    >
      <Search className="w-5 h-5 text-gray-400" />

      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
      />
    </div>
  );
}
