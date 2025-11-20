import { useState } from "react";
import { Search } from "lucide-react";
import ButtonFilter from "../../../components/button/ButtonFilter";
import TableRisikoAdmin from "../../../components/table/TabelRisikoAdmin";

export default function DaftarRisikoAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedDinas, setSelectedDinas] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleStatusChange = (val: string) =>
    setSelectedStatus(val === "Kondisi" ? "" : val);
  const handleKategoriChange = (val: string) =>
    setSelectedKategori(val === "Kategori" ? "" : val);
  const handleDinasChange = (val: string) =>
    setSelectedDinas(val === "Dinas" ? "" : val);
  const handleLevelChange = (val: string) =>
    setSelectedLevel(val === "Level" ? "" : val);

  return (
    <>
      {/* Header */}
      <div className="mb-5 px-4 md:px-0">
        <h1 className="text-lg md:text-2xl font-semibold">Daftar Risiko</h1>
        <p className="text-sm text-gray-600 mt-1">
          Kelola dan pantau seluruh risiko aset yang teridentifikasi.
        </p>
      </div>

      <div className="shadow-md bg-white rounded-lg">
        {/* Card Filter */}
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4">
          {/* 🔍 Search Bar */}
          <div className="w-full md:w-[500px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan ID, Nama, Kategori"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {/* Dinas */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Dinas
              </label>
              <ButtonFilter
                label="Pilih Dinas"
                options={["Dinas", "TI", "Non-TI"]}
                onSelect={handleDinasChange}
              />
            </div>

            {/* Kategori */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <ButtonFilter
                label="Pilih Kategori"
                options={["Kategori", "TI", "Non-TI"]}
                onSelect={handleKategoriChange}
              />
            </div>

            {/* Level */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <ButtonFilter
                label="Pilih Level"
                options={["Level", "Tinggi", "Menengah", "Rendah"]}
                onSelect={handleLevelChange}
              />
            </div>

            {/* Status / Kondisi */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <ButtonFilter
                label="Pilih Status"
                options={["Kondisi", "BAIK", "RUSAK - RINGAN", "RUSAK - BERAT"]}
                onSelect={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Table Risiko === */}
      <div className="px-2 md:px-6 mt-6 shadow-md bg-white rounded-lg">
        {" "}
        {/* mt-6 → agar tabel tidak menyatu */}
        <TableRisikoAdmin
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          selectedKategori={selectedKategori}
          selectedDinas={selectedDinas}
          selectedLevel={selectedLevel}
        />
      </div>
    </>
  );
}
