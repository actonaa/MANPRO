import { useState, memo } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import TableRisiko from "../../components/table/tablerisiko-verifikator";

export default function DaftarRisiko() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <LayoutDinas>
      <h1 className="font-medium text-sm mb-2 md:text-2xl lg:text-[28px]">
        Daftar Risiko
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Berikut merupakan daftar risiko yang teridentifikasi dalam sistem.
      </p>

      {/* 📦 Card Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full">
        <div
          className="
            flex flex-col md:flex-row md:items-end gap-6 w-full 
            md:space-x-4
          "
        >
          {/* 📅 Periode */}
          <div className="flex flex-col flex-1 min-w-full md:min-w-0 relative">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <div className="w-full [&>div]:w-full [&>button]:w-full [&>input]:w-full relative z-50">
              <StableFilterDate />
            </div>
          </div>

          {/* 🧪 Level Risiko */}
          <div className="flex flex-col flex-1 min-w-full md:min-w-0">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Level Risiko
            </label>
            <div className="w-full [&>div]:w-full [&>button]:w-full">
              <ButtonFilter
                label="Level"
                options={["Rendah", "Sedang", "Tinggi"]}
                onSelect={(val) => setSelectedLevel(val)}
              />
            </div>
          </div>

          {/* 🟢 Status Risiko */}
          <div className="flex flex-col flex-1 min-w-full md:min-w-0">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Status Risiko
            </label>
            <div className="w-full [&>div]:w-full [&>button]:w-full">
              <ButtonFilter
                label="Status"
                options={["Diterima", "Tertunda", "Ditolak"]}
                onSelect={(val) => setSelectedStatus(val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Tabel Risiko */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-200">
        <TableRisiko
          searchTerm=""
          selectedStatus={selectedStatus}
          selectedKategori={selectedLevel}
        />
      </div>
    </LayoutDinas>
  );
}

/* ✅ Prevent re-render filter tanggal */
const StableFilterDate = memo(function StableFilterDate() {
  return <FilterDate />;
});
