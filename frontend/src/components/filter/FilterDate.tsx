import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

export default function FilterDate() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // 🪄 Buat referensi ke elemen dropdown
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // 🧠 useEffect untuk deteksi klik di luar elemen
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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <div
      className="flex flex-wrap items-center gap-3 w-full md:w-auto"
      ref={calendarRef}
    >
      {/* FILTER BUTTON */}
      <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex justify-between items-center w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-gray-700 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-400 transition"
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarDays className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="truncate">
              {startDate && endDate ? `${startDate} — ${endDate}` : "Filter"}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showCalendar ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* 📅 RESPONSIVE CALENDAR POPUP */}
        {showCalendar && (
          <div
            className="
              absolute left-0 sm:left-auto sm:right-0 mt-2 
              p-4 bg-white border border-gray-200 rounded-lg shadow-lg 
              flex flex-col gap-3 
              w-full min-w-[250px]
              max-w-[90vw]
            "
          >
            {/* DARI & SAMPAI */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {/* DARI */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 mb-1">Dari:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
                />
              </div>

              {/* SAMPAI */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 mb-1">Sampai:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* 🔵 BUTTON FILTER */}
            <div className="flex justify-end w-full mt-2">
              <button
                onClick={() => setShowCalendar(false)}
                className="flex items-center gap-2 bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-600 transition"
              >
                <span>Filter</span>
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
    </div>
  );
}
