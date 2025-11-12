import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import TableAset from "../../components/table/TableAset-Auditor";

export default function JadwalPemeliharaanVerifikator() {
  const [, setSelectedLevel] = useState("");
  const [, setSelectedStatus] = useState("");
  const [, setSelectedDate] = useState<{
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
        Laporan Aset
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Pantau status dan rincian seluruh aset dalam satu tampilan.
      </p>

      {/* 📦 Card Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 📅 Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* ⚙️ Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kondisi
            </label>
            <ButtonFilter
              label="Pilih kondisi"
              options={["BAIK", "RUSAK - RINGAN", "RUSAK - BERAT"]}
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

       {/* Table tampil di semua ukuran layar */}
            <div className=" rounded-xl md:rounded-none md:rounded-b-xl">
              <TableAset />
            </div>
    </>
  );
}
