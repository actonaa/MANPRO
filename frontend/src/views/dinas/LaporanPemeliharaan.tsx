import { useState } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import ButtonImg from "../../components/button/ButtonImg";
import CardList from "../../components/card/CardList";
import TablePemeliharaan from "../../components/table/TablePemeliharaan";

export default function Pemeliharaan() {
  // State untuk filter aktif
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    console.log("Status dipilih:", val);
  };

  const handleKategoriChange = (val: string) => {
    setSelectedKategori(val);
    console.log("Kategori dipilih:", val);
  };

  return (
    <LayoutDinas>
      {/* Judul */}
      <h1 className="font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Pemeliharaan Aset
      </h1>
       {/* Tombol Import */}
        <div className="flex md:hidden w-30 ">
          <ButtonImg
            title="Import"
            img="/kelola-asset/import.png"
            justify="justify-center"
            px="4"
          />
        </div>

      {/* Kartu Statistik */}
      <div className="mb-5 overflow-x-auto pb-6 md:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList title="Total Pemeliharaan" value="1,250" />
          <CardList title="Pemeliharaan Berhasil" value="560" />
          <CardList title="Insiden" value="200" />
          <CardList title="Total Harga" value="Rp. 2,5M" />
        </div>
      </div>

      {/* Filter */}
      <div className="border-b border-[#ddd] px-4 py-4 flex flex-col gap-3 md:flex-row md:justify-between">
        {/* Filter bagian kiri */}
        <div className="flex flex-row gap-3 md:flex-row md:items-center">
          <FilterDate
            onSelect={(val) => {
              console.log("Rentang tanggal dipilih:", val);
              setSelectedDate(`${val.start} - ${val.end}`);
            }}
          />
          <ButtonFilter
            label="Kategori"
            options={["Terjadwal", "Insidental"]}
            onSelect={handleKategoriChange}
          />
          <ButtonFilter
            label="Status"
            options={["Selesai", "Berlangsung", "Dibatalkan"]}
            onSelect={handleStatusChange}
          />
        </div>

        {/* Tombol Import */}
        <div className="hidden md:justify-end">
          <ButtonImg
            title="Import"
            img="/kelola-asset/import.png"
            justify="justify-center"
            px="4"
          />
        </div>
      </div>

      {/* Tabel Data Pemeliharaan */}
      <div className="shadow-md bg-white">
        <TablePemeliharaan
          kategori={selectedKategori}
          status={selectedStatus}
          tanggal={selectedDate}
        />
      </div>
    </LayoutDinas>
  );
}
