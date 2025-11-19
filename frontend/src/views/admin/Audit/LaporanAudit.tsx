import { useState } from "react";
import TabelLaporanAuditAdmin from "../../../components/table/TabelLaporanAuditAdmin";

import SearchBar from "../../../components/filter/Search";
import FilterDinas from "../../../components/button/FilterDinas";
import FilterPeran from "../../../components/button/FilterPeran";
import FilterModul from "../../../components/button/FilterModul";
import FilterDate from "../../../components/filter/FilterDate";

import ExportModal from "../../../components/dropdown/Export";
import { Download } from "lucide-react";

const data = [
  {
    id: 1,
    datetime: "10/24/2025 - 10:45",
    user: "Rajendra Wahyu",
    dinas: "Dinas Kesehatan",
    role: "Verifikator",
    module: "Aset",
    action: "UPDATE",
  },
  {
    id: 2,
    datetime: "10/24/2025 - 10:45",
    user: "Khoirul Ansori",
    dinas: "Dinas Pendidikan",
    role: "User Dinas",
    module: "Risiko",
    action: "CREATE",
  },
  {
    id: 3,
    datetime: "10/24/2025 - 10:45",
    user: "Vio Actona",
    dinas: "Diskominfo",
    role: "Administrator",
    module: "Users",
    action: "UPDATE",
  },
  {
    id: 4,
    datetime: "10/24/2025 - 10:45",
    user: "Fahmi Akhyar",
    dinas: "Dinas Perhubungan",
    role: "Verifikator",
    module: "Aset",
    action: "DELETE",
  },
  {
    id: 5,
    datetime: "10/24/2025 - 10:45",
    user: "Vio Actona",
    dinas: "Diskominfo",
    role: "Administrator",
    module: "Users",
    action: "UPDATE",
  },
];

export default function LaporanAudit() {
  const [search, setSearch] = useState("");
  const [dinas, setDinas] = useState("");

  const [periode, setPeriode] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const [peran, setPeran] = useState("");
  const [modul, setModul] = useState("");

  const [showExport, setShowExport] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* TITLE + EXPORT BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Audit</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau semua aktivitas pengguna dan sistem.
          </p>
        </div>

        {/* === EXPORT BUTTON (DI LUAR CARD) === */}
        <button
          onClick={() => setShowExport(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`flex items-center gap-2 py-2 px-4 rounded-md border text-sm transition
            ${
              hover
                ? "bg-gray-100 border-gray-400 text-gray-800"
                : "bg-white border-gray-300 text-gray-600"
            }
          `}
        >
          <Download
            className={`w-4 h-4 ${hover ? "text-gray-800" : "text-gray-600"}`}
          />
          <span className={hover ? "text-gray-800" : "text-gray-600"}>
            Export
          </span>
        </button>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        {/* SEARCH */}
        <div className="md:w-1/3">
          <SearchBar onChange={(v) => setSearch(v)} />
        </div>

        {/* FILTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Dinas</p>
            <FilterDinas onSelect={setDinas} />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Periode</p>
            <FilterDate onSelect={(range) => setPeriode(range)} />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Peran</p>
            <FilterPeran onSelect={setPeran} />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Modul</p>
            <FilterModul onSelect={setModul} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <TabelLaporanAuditAdmin
        data={data}
        search={search}
        dinas={dinas}
        periode={
          periode.start && periode.end ? `${periode.start}_${periode.end}` : ""
        }
        kategori={peran}
        status={modul}
      />

      {/* EXPORT POPUP */}
      {showExport && (
        <ExportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          onExport={() => console.log("Export Audit:", data)}
        />
      )}
    </div>
  );
}
