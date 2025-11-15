import { useState } from "react";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import VerifikasiAset from "../../components/table/VerifikasiAset";

export default function JadwalPemeliharaanVerifikator() {
  const [selectedkondisi, setSelectedLevel] = useState("");
  const [selectedDate, setSelectedDate] = useState<{ start: string; end: string } | null>(null);

  // Tangani perubahan tanggal
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range);
  };

  return (
    <>
      {/* Judul Halaman */}
      <h1 className="font-semibold text-sm mb-2 md:text-2xl lg:text-[28px]">
        Verifikasi Aset
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Kelola dan konfirmasi aset yang menunggu persetujuan anda.
      </p>

      {/* Card Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* Kondisi */}
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
        </div>
      </div>

      {/* Tabel Verifikasi Aset */}
      <VerifikasiAset
        selectedkondisi={selectedkondisi}
        selectedDate={selectedDate}
      />
    </>
  );
}
