import { useState } from "react";
import FilterDinas from "../../../components/button/FilterDinas";
import FilterDate from "../../../components/filter/FilterDate";
import TabelSDM from "../../../components/table/TeknisiSDM";
import SearchBar from "../../../components/filter/Search";

export default function DataSDM() {
  const [search, setSearch] = useState("");
  const [filterDinas, setFilterDinas] = useState("");
  const [filterPeriode, setFilterPeriode] = useState<{
    start: string;
    end: string;
  } | null>(null);

  return (
    <>
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Data Sumber Daya Manusia
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Kelola dan konfirmasi aset yang menunggu persetujuan anda.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 lg:bg-none lg:p-0 lg:mb-0">
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Cari SDM</p>
            <SearchBar onChange={(v) => setSearch(v)} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dinas</p>
            <FilterDinas onSelect={(v) => setFilterDinas(v)} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate onSelect={(range) => setFilterPeriode(range)} />
          </div>
        </div>
      </div>

      {/* Pass filter values to TabelSDM */}
      <TabelSDM
        search={search}
        filterDinas={filterDinas}
        filterPeriode={filterPeriode}
      />
    </>
  );
}
