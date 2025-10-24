import { useState, memo } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";

export default function LaporanRisiko() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Fungsi ketika tanggal dipilih
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(`${range.start} - ${range.end}`);
  };

  return (
    <LayoutDinas>
      {/* 🏷️ Judul Halaman */}
      <h1 className="font-medium text-sm mb-2 md:text-2xl lg:text-[28px]">
        Laporan Risiko
      </h1>
      
      {/* 📦 Card Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full border border-gray-200">
        {/* 📱 MOBILE VIEW */}
        <div className="block md:hidden space-y-4">
          {/* Periode */}
          <div className="w-full">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* Kondisi & Status sejajar */}
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <ButtonFilter
                label="Kondisi"
                options={["Baik", "Rusak", "Perbaikan"]}
                onSelect={(val) => setSelectedCondition(val)}
              />
            </div>
            <div className="w-1/2">
              <ButtonFilter
                label="Status"
                options={["Diterima", "Tertunda", "Dihapus"]}
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

          {/* Kondisi */}
          <div className="w-full md:w-1/3">
            <ButtonFilter
              label="Kondisi"
              options={["Baik", "Rusak", "Perbaikan"]}
              onSelect={(val) => setSelectedCondition(val)}
            />
          </div>

          {/* Status */}
          <div className="w-full md:w-1/3">
            <ButtonFilter
              label="Status"
              options={["Diterima", "Tertunda", "Dihapus"]}
              onSelect={(val) => setSelectedStatus(val)}
            />
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}

/* ✅ Optimisasi untuk mencegah re-render */
const StableFilterDate = memo(function StableFilterDate() {
  return <FilterDate />;
});
