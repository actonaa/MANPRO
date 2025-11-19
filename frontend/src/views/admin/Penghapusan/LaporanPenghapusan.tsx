import { useState } from "react";
import SearchBar from "../../../components/filter/Search";
import FilterDate from "../../../components/filter/FilterDate";
import ExportModal from "../../../components/dropdown/Export";
import TablePenghapusan from "../../../components/table/TablePenghapusan-Admin";
import { Download } from "lucide-react";

export default function LaporanPenghapusan() {
  const [filters, setFilters] = useState({
    search: "",
    date: { start: "", end: "" },
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Laporan Penghapusan
        </h1>
        <p className="text-sm text-gray-500">
          Telusuri hasil audit dan pembaruan data setiap dinas.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 w-full">
          {/* SEARCH */}
          <div className="flex-1 min-w-[260px]">
            <SearchBar
              placeholder="Cari berdasarkan ID, Nama aset, dll..."
              onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
            />
          </div>

          {/* DATE FILTER */}
          <div className="min-w-[200px]">
            <FilterDate
              onSelect={(range) =>
                setFilters((prev) => ({ ...prev, date: range }))
              }
            />
          </div>

          {/* EXPORT BUTTON */}
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
      <TablePenghapusan filters={filters} />

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </div>
  );
}
