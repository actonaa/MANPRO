import { useState } from "react";
import ButtonFilter from "../../../components/button/ButtonFilter";
import TableJadwalPemeliharaan from "../../../components/table/JadwalPemeliharaan";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonImg from "../../../components/button/ButtonImg";
import { Search } from "lucide-react"; // 🔍 icon

export default function JadwalPemeliharaanPage() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedPrioritas, setSelectedPrioritas] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 search state

  return (
    <>
      {/* 🏷️ Judul Halaman */}
      <h1 className="font-semibold text-[22px] mb-2 md:text-2xl lg:text-[28px]">
        Jadwal Pemeliharaan
      </h1>
      <p className="text-gray-600 text-sm mb-4">
        Pantau dan kelola jadwal pemeliharaan aset berdasarkan prioritas.
      </p>

      {/* 📱 Tombol Import (mobile) */}
      <div className="flex gap-2 mb-5 md:hidden items-start justify-start">
        <div className="w-full">
          <ButtonImg
            title="Impor"
            img="/kelola-asset/import.png"
            justify="justify-center"
          />
        </div>
      </div>

       {/* 🔍 Search mobile */}
        <div className="relative w-full lg:hidden bg-white mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan ID, Nama, Kategori"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

      {/* 💻 Filter Bar (desktop) */}
      <div className="hidden md:block lg:bg-white rounded-t-xl">
        <div className="lg:border-b border-[#ddd]">
          <div className="flex justify-between px-0 lg:px-4 py-6">

            {/* Filter kiri */}
            <div className="flex gap-3 items-center">

              {/* 🔍 Search Input */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan ID, Nama, Kategori."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm
                             focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Filter tanggal */}
              <div className="w-29">
                <FilterDate />
              </div>

              {/* Filter kategori */}
              <div className="w-30">
                <ButtonFilter
                  label="Kategori"
                  options={["Aset TI", "Aset Fasilitas"]}
                  onSelect={(v) => setSelectedKategori(v)}
                />
              </div>

              {/* Filter prioritas */}
              <div className="w-29">
                <ButtonFilter
                  label="Prioritas"
                  options={["Rendah", "Sedang", "Tinggi"]}
                  onSelect={(v) => setSelectedPrioritas(v)}
                />
              </div>
            </div>

            {/* Tombol kanan */}
            <div className="flex gap-3">
              <ButtonImg
                title="Impor"
                img="/kelola-asset/import.png"
                justify="justify-center"
                px="4"
              />
            </div>

          </div>
        </div>
      </div>

      {/* 📱 Filter Bar (mobile) */}
      <div className="flex gap-3 md:hidden mb-3">

        {/* Filter tanggal */}
        <div className="w-40">
          <FilterDate />
        </div>

        <div className="w-32">
          <ButtonFilter
            label="Kategori"
            options={["Aset TI", "Aset Fasilitas"]}
            onSelect={(v) => setSelectedKategori(v)}
          />
        </div>

        <div className="w-32">
          <ButtonFilter
            label="Prioritas"
            options={["Rendah", "Sedang", "Tinggi"]}
            onSelect={(v) => setSelectedPrioritas(v)}
          />
        </div>
      </div>

      {/* 📋 Tabel Jadwal */}
      <div className="rounded-xl md:rounded-none md:rounded-b-xl">
        <TableJadwalPemeliharaan
          selectedKategori={selectedKategori}
          selectedPrioritas={selectedPrioritas}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
}
