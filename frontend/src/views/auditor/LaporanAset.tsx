import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import TableAset from "../../components/table/TableAset-Auditor";
import SearchBar from "../../components/filter/Search";
import ExportModal from "../../components/dropdown/Export";
import { Download } from "lucide-react";

export default function LaporanAset() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range);
  };

  return (
    <>
      {/* TITLE */}
      <h1 className="font-semibold text-sm mb-2 md:text-2xl lg:text-[28px]">
        Laporan Aset
      </h1>

      <p className="text-gray-500 text-sm mb-6">
        Pantau status dan rincian seluruh aset dalam satu tampilan.
      </p>

      {/* FILTER CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* SEARCH */}
          <div className="flex-1">
            <SearchBar
              placeholder="Cari berdasarkan ID, Dinas, dll..."
              onChange={(value) => setSearch(value)}
            />
          </div>

          {/* DATE FILTER */}
          <div className="w-full md:w-60">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* EXPORT BUTTON (ICON + TEXT) */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="
              flex items-center gap-2 
              border border-gray-300 rounded-lg 
              px-4 py-2 
              hover:bg-gray-50
              whitespace-nowrap
            "
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Ekspor</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl mt-6">
        <TableAset
          filters={{
            search,
            tanggal: selectedDate,
          }}
        />
      </div>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </>
  );
}
