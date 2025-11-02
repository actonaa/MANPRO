import { useState } from "react";
import RisikoTableSection from "../../components/table/LaporanRisk";
import ButtonFilter from "../../components/button/ButtonFilter";
import FilterDate from "../../components/filter/FilterDate";

export default function LaporanRisiko() {
  // ✅ State filter
  const [dinas, setDinas] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // ✅ Tangani perubahan tanggal dari FilterDate
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range);
  };

  return (
    <>
      <div className=" space-y-6">
        {/* 🏷️ Judul dan deskripsi halaman */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Risiko</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau tingkat risiko, skor, dan status seluruh risiko aset dalam
            satu tampilan.
          </p>
        </div>

        {/* 📊 Card filter */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 🏛️ Dinas */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Dinas</label>
              <ButtonFilter
                label="Pilih Dinas"
                options={[
                  "Dinas Kesehatan",
                  "Dinas Pendidikan",
                  "Dinas Kebudayaan",
                  "Dinas Perhubungan",
                  "Dinas Lingkungan Hidup",
                ]}
                onSelect={setDinas}
              />
            </div>
            {/* 📅 Periode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <FilterDate onSelect={handleDateChange} />{" "}
              {/* ✅ GANTI DI SINI */}
            </div>

            {/* 🔧 Level */}
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
                options={["Diterima", "Tertunda", "Ditolak"]}
                onSelect={setSelectedStatus}
              />
            </div>
          </div>
        </div>

        {/* 📋 Tabel risiko */}
        <RisikoTableSection
          period={`${selectedDate?.start || "-"} s.d. ${
            selectedDate?.end || "-"
          }`}
          level={selectedLevel}
          status={selectedStatus}
        />
      </div>
    </>
  );
}
