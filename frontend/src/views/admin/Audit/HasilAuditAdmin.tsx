import { useState } from "react";
import { Plus } from "lucide-react";

import SearchBar from "../../../components/filter/Search";
import DinasDropdown from "../../../components/button/FilterDinas";
import PeriodDropdown from "../../../components/filter/FilterDate";

import TabelHasilAudit from "../../../components/table/TabelHasilAuditAdmin";
import TambahAudit from "../../admin/Audit/TambahAudit"; // 🟦 IMPORT MODAL

export default function HasilAudit() {
  const [search, setSearch] = useState("");
  const [dinas, setDinas] = useState("");
  const [periode, setPeriode] = useState<{ start: string; end: string } | null>(
    null
  );

  // 🟦 STATE MODAL TAMBAH AUDIT
  const [isTambahOpen, setIsTambahOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hasil Audit</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau Hasil Audit berupa dokumen disetiap dinas.
          </p>
        </div>

        {/* 🟦 BUTTON UNGGAH → BUKA MODAL TAMBAH AUDIT */}
        <button
          onClick={() => setIsTambahOpen(true)}
          className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg hover:bg-[#1669C1]"
        >
          <Plus size={18} />
          Unggah Hasil Audit
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SEARCH */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Cari</p>
            <SearchBar
              onChange={(value) => setSearch(value)}
              placeholder="Cari dokumen..."
            />
          </div>

          {/* DINAS */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Dinas</p>
            <DinasDropdown onSelect={(val) => setDinas(val)} />
          </div>

          {/* PERIODE */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Periode</p>
            <PeriodDropdown onSelect={(range) => setPeriode(range)} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <TabelHasilAudit search={search} dinas={dinas} periode={periode} />

      {/* 🟦 MODAL TAMBAH AUDIT */}
      <TambahAudit
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
      />
    </>
  );
}
