import { useState } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import TableJadwalPemeliharaan from "../../components/table/TablePemeliharaan-verifikator";

export default function JadwalPemeliharaanVerifikator() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // 🔹 Ambil tanggal dari FilterDate
  const handleDateChange = (range: { start: string; end: string }) => {
    setSelectedDate(range.start);
  };

  return (
    <LayoutDinas>
      {/* 🧭 Header */}
      <div className="mb-5 px-4 md:px-0">
        <h1 className="text-lg md:text-2xl font-semibold">
          Jadwal Pemeliharaan Aset
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Kelola dan konfirmasi jadwal pemeliharaan aset sesuai periode dan
          status untuk proses verifikasi.
        </p>
      </div>

      {/* 📦 Filter Section */}
      <div className="shadow-md bg-white rounded-lg p-4 mb-6">
        {/* 🔹 Baris Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          {/* Bagian kiri: Filter Tanggal */}
          <div className="w-full md:w-1/3">
            <FilterDate onSelect={handleDateChange} />
          </div>

          {/* Bagian tengah: Filter Prioritas */}
          <div className="w-full md:w-1/3">
            <ButtonFilter
              label="Prioritas"
              options={["Rendah", "Sedang", "Tinggi"]}
              onSelect={(val) => setSelectedLevel(val)}
            />
          </div>

          {/* Bagian kanan: Filter Status */}
          <div className="w-full md:w-1/3">
            <ButtonFilter
              label="Status"
              options={["Dijadwalkan", "Selesai", "Tertunda"]}
              onSelect={(val) => setSelectedStatus(val)}
            />
          </div>
        </div>
      </div>

      {/* 📊 Tabel Jadwal Pemeliharaan */}
      <div className="shadow-md bg-white rounded-lg p-4">
        <TableJadwalPemeliharaan
          selectedKategori={selectedLevel}
          selectedStatus={selectedStatus}
          selectedDate={selectedDate}
        />
      </div>
    </LayoutDinas>
  );
}
