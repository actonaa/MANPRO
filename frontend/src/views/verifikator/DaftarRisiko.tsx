import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import TableRisiko from "../../components/table/TableRisiko-verifikator";

export default function DaftarRisiko() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<{ start: string; end: string } | null>(null);

  // ✅ Tangani perubahan tanggal
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range);
  };

  return (
    <>
      {/* 🧭 Judul Halaman */}
      <h1 className="font-semibold text-sm mb-2 md:text-2xl lg:text-[28px]">
        Verifikasi Risiko
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Kelola dan konfirmasi risiko yang menunggu persetujuan anda.
      </p>

      {/* 📊 Card Filter */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 📅 Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* 🔧 Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <ButtonFilter
              label="Pilih level"
              options={["Low", "Medium", "High"]}
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
              options={["Diterima", "Tertunda", "Ditolak"]}
              onSelect={setSelectedStatus}
            />
          </div>
        </div>
      </div>

      {/* 📋 Tabel Risiko */}
      <TableRisiko
        selectedLevel={selectedLevel}
        selectedDate={selectedDate}
      />
    </>
  );
}
