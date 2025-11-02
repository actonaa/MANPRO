import { useState } from "react";
import RisikoTableSection from "../../components/table/TabelRisiko-Auditor";
import ButtonFilter from "../../components/button/ButtonFilter";
import FilterDate from "../../components/filter/FilterDate";

export default function LaporanRisiko() {
  // ✅ State filter lengkap
  const [filters, setFilters] = useState({
    kategori: "",
    dinas: "",
    search: "",
    level: "",
    status: "",
    date: { start: "", end: "" },
  });

  // 🔹 Update filter umum (dinas, level, status, kategori)
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Tangani perubahan tanggal dari FilterDate
  const handleDateChange = (range: { start: string; end: string }) => {
    setFilters((prev) => ({ ...prev, date: range }));
  };

  return (
    <>
      <div className="space-y-6">
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
          <div className="flex flex-wrap gap-4 w-full">
            {/* 🏛️ Dinas */}
            <div className="flex flex-col flex-grow min-w-[220px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Dinas
              </label>
              <ButtonFilter
                label="Pilih Dinas"
                options={[
                  "Dinas Kesehatan",
                  "Dinas Pendidikan",
                  "Dinas Kebudayaan",
                  "Dinas Perhubungan",
                  "Dinas Lingkungan Hidup",
                ]}
                onSelect={(value) => handleFilterChange("dinas", value)}
              />
            </div>

            {/* 📅 Periode */}
            <div className="flex flex-col flex-grow min-w-[220px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <FilterDate onSelect={handleDateChange} />
            </div>

            {/* ⚙️ Level */}
            <div className="flex flex-col flex-grow min-w-[220px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <ButtonFilter
                label="Pilih level"
                options={["Rendah", "Sedang", "Tinggi"]}
                onSelect={(value) => handleFilterChange("level", value)}
              />
            </div>

            {/* 📊 Status */}
            <div className="flex flex-col flex-grow min-w-[220px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <ButtonFilter
                label="Pilih status"
                options={["Diterima", "Tertunda", "Ditolak"]}
                onSelect={(value) => handleFilterChange("status", value)}
              />
            </div>
          </div>
        </div>

        {/* 📋 Tabel risiko */}
        <RisikoTableSection filters={filters} />
      </div>
    </>
  );
}
