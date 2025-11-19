import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

export default function FilterButtonBase({
  label,
  options,
  selected,
  onSelect,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(selected || "");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown
  const toggleOpen = () => setIsOpen(!isOpen);

  // Handle selection
  const handleSelect = (value: string) => {
    setInternalSelected(value);
    setIsOpen(false);
    onSelect(value);
  };

  // Click outside handler
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, [isOpen]);

  return (
    <div className="flex flex-wrap items-center gap-3 w-full" ref={dropdownRef}>
      <div className="relative w-full">
        {/* BTN */}
        <button
          onClick={toggleOpen}
          className="flex justify-between items-center w-full bg-white border border-gray-300 
                     rounded-lg lg:rounded-[12px] px-4 py-3 text-gray-700 
                     focus:ring-2 focus:ring-blue-400 transition"
        >
          <span className="text-sm font-semibold text-[#6B7280]">
            {internalSelected || label}
          </span>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* DROPDOWN */}
        {isOpen && (
          <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-md w-full z-20">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700"
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
