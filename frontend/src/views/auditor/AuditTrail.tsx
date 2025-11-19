import { useState } from "react";
import SearchBar from "../../components/filter/Search";
import FilterDate from "../../components/filter/FilterDate";
import ExportModal from "../../components/dropdown/Export";
import { Download } from "lucide-react";
import TableAuditTrail from "../../components/table/AuditTrail-Auditor";

export default function AuditTrail() {
  const [filters, setFilters] = useState({
    search: "",
    date: { start: "", end: "" },
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleDateChange = (range: any) => {
    setFilters((prev) => ({ ...prev, date: range }));
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Audit Trail</h1>
        <p className="text-sm text-gray-500">
          Pantau Aktivitas Sistem dan pembaruan data setiap dinas.
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 w-full">
          {/* SEARCH */}
          <div className="flex-1 min-w-[260px]">
            <SearchBar
              placeholder="Cari berdasarkan Dinas, Modul, dll..."
              onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
            />
          </div>

          {/* FILTER DATE */}
          <div className="min-w-[200px]">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* EXPORT */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Ekspor
          </button>
        </div>

        {/* EXPORT MODAL */}
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          onExport={() => setIsExportOpen(false)}
        />
      </div>

      {/* TABLE (Dipanggil dari file lain) */}
      <TableAuditTrail filters={filters} />
    </div>
  );
}
