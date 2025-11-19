import { useState } from "react";

import SearchBar from "../../../components/filter/Search";
import FilterDinas from "../../../components/button/FilterDinas";
import FilterDate from "../../../components/filter/FilterDate";

import { Download } from "lucide-react";
import ExportModal from "../../../components/dropdown/Export";
import TablePemeliharaanAdmin from "../../../components/table/LaporanTablePemeliharaanAdmin";

export default function PemeliharaanAdmin() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDinas, setSelectedDinas] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <>
      {/* 🏷️ Judul */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-sm md:text-2xl lg:text-[28px] text-gray-800">
          Laporan Pemeliharaan
        </h1>
      </div>

      {/* 📱 Tombol Export Mobile */}
      <div className="block lg:hidden w-full mb-4">
        <button
          onClick={() => setIsExportOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md border transition 
    ${
      isHovered
        ? "bg-[#0095E8] border-[#0095E8] text-white"
        : "bg-white border-[#0095E8] text-[#0095E8]"
    }`}
        >
          <Download
            className={`w-4 h-4 transition ${
              isHovered ? "text-white" : "text-[#0095E8]"
            }`}
          />
          Export
        </button>
      </div>

      {/* 🎯 Filter Bar */}
      <div className="border-b bg-white rounded-t-xl border-[#ddd] px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          <SearchBar onChange={(v: string) => setSearchText(v)} />
          <FilterDinas onSelect={(v: string) => setSelectedDinas(v)} />
          <FilterDate
            onSelect={(val) => setSelectedDate(`${val.start} - ${val.end}`)}
          />
        </div>

        {/* Export Desktop */}
        <div className="hidden lg:flex justify-end mt-4">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl shadow-md border border-gray-300 bg-white text-gray-600"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* 📋 Table */}
      <TablePemeliharaanAdmin
        tanggal={selectedDate}
        dinas={selectedDinas}
        search={searchText}
      />

      {/* 🪟 Modal Export */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </>
  );
}
