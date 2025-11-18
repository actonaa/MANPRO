import { useState } from "react";

import AssetTableSection from "../../../components/table/TableLaporanAsetAdmim";

// FILTER BUTTON (baru)
import DinasDropdown from "../../../components/button/FilterDinas";
import FilterKondisi from "../../../components/button/FilterKondisi";
import FilterStatus from "../../../components/button/FilterStatus";

// FILTER LAIN
import PeriodDropdown from "../../../components/filter/FilterDate";
import SearchBar from "../../../components/filter/Search";

export default function LaporanAset() {
  // State Search dan Filter
  const [search, setSearch] = useState("");
  const [dinas, setDinas] = useState("");
  const [period, setPeriod] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Judul Halaman */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Aset</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau status dan rincian seluruh aset dalam satu tampilan.
          </p>
        </div>

        {/* CARD FILTER */}
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4">
          {/* 🔍 SEARCH BAR DI ATAS & SETENGAH LEBAR */}
          <div className="w-full flex">
            <div className="w-full md:w-1/2">
              <SearchBar onChange={(value) => setSearch(value)} />
            </div>
          </div>

          {/* GRID FILTER BUTTON */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* DINAS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dinas
              </label>
              <DinasDropdown onSelect={setDinas} />
            </div>

            {/* PERIODE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <PeriodDropdown
                onSelect={(range) => {
                  // range = { start: "...", end: "..." }
                  setPeriod(`${range.start} — ${range.end}`);
                }}
              />
            </div>

            {/* KONDISI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kondisi
              </label>
              <FilterKondisi onSelect={setCondition} />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <FilterStatus onSelect={setStatus} />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <AssetTableSection
          search={search}
          dinas={dinas}
          period={period}
          condition={condition}
          status={status}
        />
      </div>
    </>
  );
}
