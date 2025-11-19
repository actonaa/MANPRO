import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

type FilterDateProps = {
  onSelect?: (dateRange: { start: string; end: string }) => void;
};

export default function FilterDate({ onSelect }: FilterDateProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // 🔹 Kirim data tanggal ke parent
  const handleApplyFilter = () => {
    if (onSelect) {
      onSelect({ start: startDate, end: endDate });
    }
    setShowCalendar(false);
  };

  return (
    <div className="relative w-full" ref={calendarRef}>
      {/* 🔘 Tombol utama filter — tampilan disamakan dengan ButtonFilter */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="
          flex justify-between items-center
          w-full h-[44px]
          border border-gray-300 rounded-lg
          bg-white 
          px-3 text-gray-700
          focus:ring-2 focus:ring-blue-400 focus:outline-none
          transition-all duration-150
        "
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <span className="truncate text-sm font-semi text-[#6B7280]">
            {startDate && endDate
              ? `${startDate} — ${endDate}`
              : "Filter"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            showCalendar ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 🗓️ Dropdown Kalender */}
      {showCalendar && (
        <div
          className="
            absolute top-full left-0 mt-2
            bg-white border border-gray-200 rounded-xl shadow-xl z-50
            flex flex-col gap-3 p-4
            w-full sm:min-w-[350px] max-w-[95vw]
          "
        >
          {/* 🔹 Input tanggal range */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col w-full">
              <label className="text-xs text-gray-500 mb-1">Dari:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="
                  border border-gray-300 rounded-lg
                  px-2 py-1.5 text-gray-700 text-sm
                  focus:ring-2 focus:ring-blue-400 focus:outline-none
                  w-full
                "
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-xs text-gray-500 mb-1">Sampai:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="
                  border border-gray-300 rounded-lg
                  px-2 py-1.5 text-gray-700 text-sm
                  focus:ring-2 focus:ring-blue-400 focus:outline-none
                  w-full
                "
              />
            </div>
          </div>

          {/* 🔹 Tombol Terapkan */}
          <div className="flex justify-end w-full mt-2">
            <button
              onClick={handleApplyFilter}
              className="
                flex items-center gap-2 
                bg-blue-500 text-white 
                text-sm font-medium rounded-lg 
                px-4 py-2 hover:bg-blue-600 
                transition-all duration-150
              "
            >
              <span>Terapkan</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
