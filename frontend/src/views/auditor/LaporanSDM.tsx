import { useState } from "react";
import SearchBar from "../../components/filter/Search";
import FilterDate from "../../components/filter/FilterDate";
import ExportModal from "../../components/dropdown/Export";
import TableSDM from "../../components/table/TableSDM-Auditor";
import { Download } from "lucide-react";

export default function LaporanSDM() {
  const [filters, setFilters] = useState({
    search: "",
    date: { start: "", end: "" },
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleDateChange = (range: { start: string; end: string }) => {
    setFilters((prev) => ({ ...prev, date: range }));
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Laporan Sumber Daya Manusia
        </h1>
        <p className="text-sm text-gray-500">
          Telusuri hasil audit dan pembaruan data disetiap dinas.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="flex-1 min-w-[260px]">
            <SearchBar
              placeholder="Cari berdasarkan ID, Nama, dll..."
              onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
            />
          </div>

          {/* DATE FILTER */}
          <div className="min-w-[220px]">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* EXPORT */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 
            text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Ekspor
          </button>
        </div>
      </div>

      {/* TABLE */}
      <TableSDM filters={filters} />

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </div>
  );
}
