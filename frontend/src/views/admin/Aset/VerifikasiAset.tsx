import { useState } from "react";
import { Search } from "lucide-react";
import ButtonFilter from "../../../components/button/ButtonFilter";
import VerifikasiAsetAdmin from "../../../components/table/VerifikasiAsetAdmin";
import FilterDate from "../../../components/filter/FilterDate";

export default function VerifikasiPenghapusanAdminPage() {
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  // Kategori
  const handleKategoriChange = (value: string) => {
    setCategory(value === "Kategori" ? "" : value);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Judul */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Verifikasi Penghapusan
        </h1>
      </div>

      {/* Card Filter */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4">
        {/* 🔍 Search Bar */}
        <div className="relative w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari aset berdasarkan nama atau ID..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Periode (Menggunakan FilterDate) */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate />
          </div>

          {/* Kondisi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kondisi
            </label>
            <ButtonFilter
              label="Kondisi"
              options={["Kondisi", "BAIK", "RUSAK - RINGAN", "RUSAK - BERAT"]}
              onSelect={(value) =>
                setCondition(value === "Kondisi" ? "" : value)
              }
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <ButtonFilter
              label="Kategori"
              options={["Kategori", "TI", "Non-TI"]}
              onSelect={handleKategoriChange}
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <VerifikasiAsetAdmin
        selectedKondisi={condition}
        selectedKategori={category}
        searchQuery={search}
      />
    </div>
  );
}
