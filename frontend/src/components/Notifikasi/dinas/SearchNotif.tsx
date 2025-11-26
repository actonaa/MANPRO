import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

interface SearchNotifProps {
  onSearch: (value: string) => void;
}

export default function SearchNotif({ onSearch }: SearchNotifProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Telusuri Notifikasi"
          onChange={handleChange}
          className="w-full bg-gray-100 text-gray-500 placeholder-gray-400 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>
    </div>
  );
}
