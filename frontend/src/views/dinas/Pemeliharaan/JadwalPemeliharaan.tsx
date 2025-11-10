import { useState } from "react";
import ButtonFilter from "../../../components/button/ButtonFilter";
import TableJadwalPemeliharaan from "../../../components/table/JadwalPemeliharaan";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonImg from "../../../components/button/ButtonImg";

export default function JadwalPemeliharaanPage() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedPrioritas, setSelectedPrioritas] = useState("");

  const handleKategoriChange = (value: string) => {
    setSelectedKategori(value);
    console.log("Kategori dipilih:", value);
  };

  const handlePrioritasChange = (value: string) => {
    setSelectedPrioritas(value);
    console.log("Prioritas dipilih:", value);
  };

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

      {/* 💻 Filter Bar (desktop) */}
      <div className="hidden md:block lg:bg-white rounded-t-xl">
        <div className="lg:border-b border-[#ddd]">
          <div className="flex justify-between px-0 lg:px-4 py-6">
            {/* Filter kiri */}
            <div className="flex gap-3 items-center">
              <FilterDate />
              <ButtonFilter
                label="Kategori"
                options={["Aset TI", "Aset Fasilitas"]}
                onSelect={handleKategoriChange}
              />
              <ButtonFilter
                label="Prioritas"
                options={["Rendah", "Sedang", "Tinggi"]}
                onSelect={handlePrioritasChange}
              />
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
        <FilterDate />
        <ButtonFilter
          label="Kategori"
          options={["Aset TI", "Aset Fasilitas"]}
          onSelect={handleKategoriChange}
        />
        <ButtonFilter
          label="Prioritas"
          options={["Rendah", "Sedang", "Tinggi"]}
          onSelect={handlePrioritasChange}
        />
      </div>

      {/* 📋 Tabel Jadwal */}
      <div className="rounded-xl md:rounded-none md:rounded-b-xl">
        <TableJadwalPemeliharaan
          selectedKategori={selectedKategori}
          selectedPrioritas={selectedPrioritas}
        />
      </div>
    </>
  );
}
