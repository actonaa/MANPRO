import { useState } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import ButtonFilter from "../../components/button/ButtonFilter";
import TableJadwalPemeliharaan from "../../components/table/JadwalPemeliharaan";
import FilterDate from "../../components/filter/FilterDate";
import ButtonImg from "../../components/button/ButtonImg"; // pastikan path benar

export default function JadwalPemeliharaanPage() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fungsi untuk menangani perubahan filter
  const handleKategoriChange = (value: string) => {
    setSelectedKategori(value);
    console.log("Kategori dipilih:", value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    console.log("Status dipilih:", value);
  };

  return (
    <LayoutDinas>
      {/* Header */}
      <div className="mb-5 px-4 md:px-0">
        <h1 className="text-lg md:text-2xl font-semibold">
          Jadwal Pemeliharaan Aset
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Pantau dan kelola jadwal pemeliharaan aset berdasarkan prioritas.
        </p>
        {/* Kanan: Tombol Import */}
        <div className="md:hidden ">
          <ButtonImg
            title="Impor"
            img="/kelola-asset/import.png"
            justify="justify-center"
            px="4"
          />
        </div>
      </div>

      {/* Kontainer tabel */}
      <div className="shadow-md bg-white rounded-lg p-4">
        {/* 🔹 Filter section */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          {/* Kiri: Filter Buttons */}
          <div className="flex flex-row items-center gap-2">
            <FilterDate />
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Aset Non TI"]}
              onSelect={handleKategoriChange}
            />
            <ButtonFilter
              label="Status"
              options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              onSelect={handleStatusChange}
            />
          </div>

          {/* Kanan: Tombol Import */}
          <div className="hidden  md:justify-end md:flex">
            <ButtonImg
              title="Impor"
              img="/kelola-asset/import.png"
              justify="justify-center"
              px="4"
            />
          </div>
        </div>

        {/* 🔹 Tabel Jadwal */}
        <TableJadwalPemeliharaan
          selectedKategori={selectedKategori}
          selectedStatus={selectedStatus}
        />
      </div>
    </LayoutDinas>
  );
}
