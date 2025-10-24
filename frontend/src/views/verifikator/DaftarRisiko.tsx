import { useState, memo } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";

export default function DaftarRisiko() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Tambahkan fungsi ini agar error hilang
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range.start);
  };

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
        {/* 📱 MOBILE VIEW */}
        <div className="block md:hidden">
          {/* Periode */}
          <div className="w-full mb-4">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* Prioritas & Status sejajar */}
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <ButtonFilter
                label="Prioritas"
                options={["Rendah", "Sedang", "Tinggi"]}
                onSelect={(val) => setSelectedLevel(val)}
              />
            </div>
            <div className="w-1/2">
              <ButtonFilter
                label="Status"
                options={["Dijadwalkan", "Selesai", "Tertunda"]}
                onSelect={(val) => setSelectedStatus(val)}
              />
            </div>
          </div>
        </div>

        {/* 💻 DESKTOP VIEW */}
        <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4 w-full">
          {/* Periode */}
          <div className="w-full md:w-1/3">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* Prioritas */}
          <div className="w-full md:w-1/3">
            <ButtonFilter
              label="Prioritas"
              options={["Rendah", "Sedang", "Tinggi"]}
              onSelect={(val) => setSelectedLevel(val)}
            />
          </div>

          {/* Status */}
          <div className="w-full md:w-1/3">
            <ButtonFilter
              label="Status"
              options={["Dijadwalkan", "Selesai", "Tertunda"]}
              onSelect={(val) => setSelectedStatus(val)}
            />
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
