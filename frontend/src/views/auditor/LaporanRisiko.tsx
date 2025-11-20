import { useState } from "react";
import RisikoTableSection from "../../components/table/TabelRisiko-Auditor";
import FilterDate from "../../components/filter/FilterDate";
import SearchBar from "../../components/filter/Search";
import ExportModal from "../../components/dropdown/Export";
import { Download } from "lucide-react";

export default function LaporanRisiko() {
  const [filters, setFilters] = useState({
    search: "",
    date: { start: "", end: "" },
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleDateChange = (range: { start: string; end: string }) => {
    setFilters((prev) => ({ ...prev, date: range }));
  };

  return (
    <>
      <div className="space-y-6">
        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Risiko</h1>
          <p className="text-sm text-gray-500">
            Pantau tingkat risiko, skor, dan status seluruh risiko aset.
          </p>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4 w-full">
            {/* SEARCH */}
            <div className="flex-1">
              <SearchBar
                placeholder="Cari berdasarkan ID, Nama Aset, dll..."
                onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
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

        {/* TABLE SECTION */}
        <RisikoTableSection filters={filters} />
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
