import { useState } from "react";
import PeriodDropdown from "../../../components/asset/dinas/PeriodDropdown";
import AssetTableSection from "../../../components/asset/dinas/AssetTableSection";
import { Search } from "lucide-react";
import ButtonFilter from "../../../components/button/ButtonFilter";

export default function LaporanAset() {
  const [period, setPeriod] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // handler untuk ButtonFilter kategori
  const handleKategoriChange = (value: string) => {
    setCategory(value === "Kategori" ? "" : value);
  };

  // handler untuk ButtonFilter kondisi
  const handleConditionChange = (value: string) => {
    setCondition(value === "Kondisi" ? "" : value);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Judul */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Laporan Aset</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau status dan rincian seluruh aset dalam satu tampilan.
        </p>
      </div>

      {/* Filter Card */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        {/* Search */}
        <div className="mb-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan ID, Nama, Kategori"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-[300px] text-sm pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Perolehan
            </label>
            <PeriodDropdown onChange={setPeriod} />
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

          {/* Kondisi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kondisi
            </label>
            <ButtonFilter
              label="Kondisi"
              options={["Kondisi", "Baik", "Rusak Ringan", "Rusak Berat"]}
              onSelect={handleConditionChange}
            />
          </div>
        </div>
      </div>

      {/* Tabel Aset */}
      <AssetTableSection
        period={period}
        category={category}
        condition={condition}
        searchValue={searchValue}
      />
    </div>
  );
}
