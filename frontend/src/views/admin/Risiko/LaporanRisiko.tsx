import { useState } from "react";

// FILTER
import DinasDropdown from "../../../components/button/FilterDinas";
import FilterStatus from "../../../components/button/FilterStatus";
import LevelDropdown from "../../../components/button/FilterLevel";

// FILTER LAIN
import PeriodDropdown from "../../../components/filter/FilterDate";
import SearchBar from "../../../components/filter/Search";

// TABLE
import RisikoTableSection from "../../../components/table/LaporanRisikoAdmin";

export default function LaporanRisiko() {
  const [search, setSearch] = useState("");
  const [dinas, setDinas] = useState("");
  const [period, setPeriod] = useState<{ start: string; end: string } | null>(
    null
  );
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Laporan Risiko</h1>
        <p className="text-sm text-gray-500 mt-1">
          Analisis laporan risiko yang telah diidentifikasi dan ditangani
          berdasarkan kategori, tingkat keparahan, dan status mitigasi saat ini.
        </p>
      </div>

      {/* FILTER CARD (SAMA SEPERTI ASET) */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4">
        {/* SEARCH BAR */}
        <div className="w-full flex">
          <div className="w-full md:w-1/2">
            <SearchBar onChange={(v: string) => setSearch(v)} />
          </div>
        </div>

        {/* GRID FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* DINAS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dinas
            </label>
            <DinasDropdown
              onSelect={(v: string) => setDinas(v.toLowerCase())}
            />
          </div>

          {/* PERIODE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <PeriodDropdown
              onSelect={(range) => {
                setPeriod(range);
              }}
            />
          </div>

          {/* LEVEL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level Risiko
            </label>
            <LevelDropdown onSelect={(v: string) => setLevel(v)} />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <FilterStatus onSelect={(v: string) => setStatus(v)} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <RisikoTableSection
        search={search}
        dinas={dinas}
        period={period}
        level={level}
        status={status}
      />
    </div>
  );
}
