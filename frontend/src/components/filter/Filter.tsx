import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type FilterProps = {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
};

export default function Filter({ label, options, onSelect }: FilterProps) {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    if (onSelect) onSelect(value);
  };

  // ✅ Deteksi klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className="flex flex-wrap items-center gap-3 w-full md:w-auto"
      ref={dropdownRef}
    >
      <div className="relative w-full sm:w-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-gray-700 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-400 transition"
        >
          <span>{selected || label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-md w-full z-10 min-w-[120px] max-w-[90vw]">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
