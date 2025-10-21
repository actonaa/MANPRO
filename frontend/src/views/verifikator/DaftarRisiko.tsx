import { useState, memo } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";

export default function DaftarRisiko() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <LayoutDinas>
      {/* 🧭 Judul */}
      <h1 className="font-medium text-sm mb-2 md:text-2xl lg:text-[28px]">
        Daftar Risiko
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Kelola dan konfirmasi risiko yang menunggu persetujuan anda.
      </p>

      {/* 📦 Card Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full">
        <div className="flex flex-col gap-6 w-full md:grid md:grid-cols-3 md:gap-6">
          {/* 📅 Periode */}
          <div className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <div className="w-full [&>div]:w-full [&>button]:w-full [&>input]:w-full relative z-50">
              <StableFilterDate />
            </div>
          </div>

          {/* 🧪 Level & 🟢 Status → horizontal di mobile */}
          <div className="flex gap-4 w-full">
            {/* Level */}
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <div className="w-full [&>div]:w-full [&>button]:w-full">
                <ButtonFilter
                  label="Pilih Level"
                  options={["Rendah", "Sedang", "Tinggi"]}
                  onSelect={(val) => setSelectedLevel(val)}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="w-full [&>div]:w-full [&>button]:w-full">
                <ButtonFilter
                  label="Pilih Status"
                  options={["Diterima", "Tertunda", "Ditolak"]}
                  onSelect={(val) => setSelectedStatus(val)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}

/* ✅ Prevent re-render untuk filter tanggal */
const StableFilterDate = memo(function StableFilterDate() {
  return <FilterDate />;
});
