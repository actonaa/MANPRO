import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import LaporanPemeliharaan from "../../components/table/LaporanPemeliharaan-verifikator";

export default function JadwalPemeliharaanVerifikator() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // ✅ Tangani perubahan tanggal
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range);
  };

  return (
    <>
      {/* 🧭 Judul Halaman */}
      <h1 className="font-semibold text-sm mb-2 md:text-2xl xl:text-[28px]">
        Laporan Pemeliharaan 
      </h1>
      {/* 📦 Card Filter */}
      <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 📅 Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* 🔧 Prioritas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <ButtonFilter
              label="Pilih level"
              options={["Rendah", "Sedang", "Tinggi"]}
              onSelect={setSelectedLevel}
            />
          </div>

          {/* 📊 Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <ButtonFilter
              label="Pilih status"
              options={["Dijadwalkan", "Selesai", "Tertunda"]}
              onSelect={setSelectedStatus}
            />
          </div>
        </div>
      </div>

      {
      <LaporanPemeliharaan
        selectedLevel={selectedLevel}
        selectedStatus={selectedStatus}
        selectedDate={selectedDate}
      /> 
      }
    </>
  );
}
