import { useState } from "react";
import LayoutDinas from "../layout/LayoutDinas";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import ButtonImg from "../../components/button/ButtonImg";
import CardList from "../../components/card/CardList";
import TablePemeliharaan from "../../components/table/TablePemeliharaan";

export default function Pemeliharaan() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleStatusChange = (val: string) => setSelectedStatus(val);
  const handleKategoriChange = (val: string) => setSelectedKategori(val);

  return (
    <LayoutDinas>
      {/* 🏷️ Judul Halaman */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-medium text-sm md:text-2xl lg:text-[28px] text-gray-800">
          Pemeliharaan
        </h1>
      </div>

      {/* 📱 Tombol Import di atas (mobile only) */}
      <div className="block lg:hidden w-full mb-4">
        <ButtonImg
          title="Import"
          img="/kelola-asset/import.png"
          justify="justify-center"
          px="4"
        />
      </div>

      {/* 📊 Kartu Statistik */}
      <div className="mb-5 overflow-x-auto pb-6 lg:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid lg:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList title="Total Pemeliharaan" value="1,250" />
          <CardList title="Pemeliharaan Berhasil" value="560" />
          <CardList title="Insiden" value="200" />
          <CardList title="Total Harga" value="Rp. 2,5M" />
        </div>
      </div>

      {/* 🎯 Filter Bar */}
      <div className="border-b border-[#ddd] px-4 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-row gap-3 items-center">
          <FilterDate
            onSelect={(val) => {
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

        {/* 📦 Tombol Import di kanan (desktop only) */}
        <div className="hidden lg:flex">
          <ButtonImg
            title="Import"
            img="/kelola-asset/import.png"
            justify="justify-center"
            px="4"
          />
        </div>
      </div>

      {/* 📋 Tabel Data */}
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
