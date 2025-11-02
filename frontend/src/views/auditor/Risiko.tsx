import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import LaporanRiskVerif from "../../components/table/TableDataRisiko";
import ButtonImg from "../../components/button/ButtonImg";

export default function DaftarRisiko() {
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
      <h1 className="font-semibold text-sm mb-2 md:text-2xl lg:text-[28px]">
        Data Risiko
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Kelola dan panatu risiko yang menunggu persetujuan anda.
      </p>

      {/* 📊 Filter Bar & Tombol Ekspor */}
      <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 mb-8">
        {/* 🔹 Flex agar tombol Ekspor tetap di baris yang sama */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* 🔹 Kiri: Filter Group */}
          <div className="flex flex-wrap items-center gap-3 flex-grow">
            {/* 🔍 Input Pencarian */}
            <div className="relative w-full sm:w-[220px] md:w-[240px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari berdasarkan ID, Nama, Kategori"
                className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full"
              />
            </div>

            {/* 🔘 Kategori */}
            <div className="w-full sm:w-auto">
              <ButtonFilter
                label="Kategori"
                options={["Aset TI", "Aset Non TI"]}
              />
            </div>

            {/* 📅 Periode */}
            <div className="w-full sm:w-auto">
              <FilterDate onSelect={handleDateChange} />
            </div>

            {/* 🔘 Status */}
            <div className="w-full sm:w-auto">
              <ButtonFilter
                label="Status"
                options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              />
            </div>

            {/* 🔘 Pilih Dinas */}
            <div className="w-full sm:w-auto">
              <ButtonFilter
                label="Pilih Dinas"
                options={[
                  "Dinas Kesehatan",
                  "Dinas Pendidikan",
                  "Dinas Kebudayaan",
                  "Dinas Perhubungan",
                  "Dinas Lingkungan Hidup",
                ]}
              />
            </div>
          </div>

          {/* 📁 Kanan: Tombol Ekspor */}
          <div className="flex-shrink-0">
            <ButtonImg
              title="Export"
              img="/kelola-asset/export.png"
              justify="justify-center"
            />
          </div>
        </div>
      </div>

      {/* 📋 Tabel Risiko */}
      <LaporanRiskVerif
        selectedLevel={selectedLevel}
        selectedStatus={selectedStatus}
        selectedDate={selectedDate}
      />
    </>
  );
}
