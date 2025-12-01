import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import TableAset from "../../components/table/TableAset-Auditor";
import SearchBar from "../../components/filter/Search";
import ExportModal from "../../components/dropdown/Export";
import { Download } from "lucide-react";

export default function LaporanAset() {
  const [filters, setFilters] = useState({
    search: "",
    tanggal: { start: "", end: "" },
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleDateChange = (range: { start: string; end: string }) => {
    setFilters((prev) => ({
      ...prev,
      tanggal: range,
    }));
  };

  return (
    <>
      <h1 className="font-semibold text-sm mb-2 md:text-2xl lg:text-[28px]">
        Laporan Aset
      </h1>

      <p className="text-gray-500 text-sm mb-6">
        Pantau status dan rincian seluruh aset dalam satu tampilan.
      </p>

      {/* FILTER CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap md:flex-row items-center gap-4 w-full">
          
          {/* SEARCH */}
          <div className="flex-1">
            <SearchBar
              placeholder="Cari berdasarkan ID, Nama Aset, dll..."
              value={filters.search}
              onChange={(v) =>
                setFilters((p) => ({
                  ...p,
                  search: v,
                }))
              }
            />
          </div>

          {/* DATE */}
          <div className="w-full md:w-60">
            <FilterDate onSelect={handleDateChange} value={filters.tanggal} />
          </div>

          {/* EXPORT */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Ekspor</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl mt-6">
        <TableAset filters={filters} />
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
