import { useState } from "react";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import ButtonImg from "../../../components/button/ButtonImg";
import CardList from "../../../components/card/CardList";
import TablePemeliharaan from "../../../components/table/TablePemeliharaan";

export default function Pemeliharaan() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleKategoriChange = (val: string) => setSelectedKategori(val);

  return (
    <>
      {/* 🏷️ Judul Halaman */}
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Pemeliharaan
      </h1>

      {/* 📱 Tombol Import (mobile) */}
      <div className="flex gap-2 mb-5 md:hidden items-start justify-start">
        <div className="w-full">
          <ButtonImg
            title="Import"
            img="/kelola-asset/import.png"
            justify="justify-center"
          />
        </div>
      </div>

      {/* 📊 Kartu Statistik */}
      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList title="Total Pemeliharaan" value="1,250" />
          <CardList title="Pemeliharaan Berhasil" value="560" />
          <CardList title="Insiden" value="200" />
          <CardList title="Total Harga" value="Rp. 2,5M" />
        </div>
      </div>

      {/* 📱 Filter untuk mobile */}
      <div className="flex gap-3 md:hidden">
        <FilterDate
          onSelect={(val) => {
            setSelectedDate(`${val.start} - ${val.end}`);
          }}
        />
        <ButtonFilter
          label="Jenis"
          options={["Terjadwal", "Insidental"]}
          onSelect={handleKategoriChange}
        />
      </div>

      <div className="hidden md:block lg:bg-white rounded-t-xl">
        <div className="lg:border-b border-[#ddd]">
          <div className="flex justify-between px-0 lg:px-4 py-8">
            <div className="flex gap-3 items-center">
              <ButtonFilter
                label="Jenis"
                options={["Terjadwal", "Insidental"]}
                onSelect={handleKategoriChange}
              />
              <FilterDate
                onSelect={(val) => {
                  setSelectedDate(`${val.start} - ${val.end}`);
                }}
              />
            </div>
            <div className="flex gap-3">
              <ButtonImg
                title="Import"
                img="/kelola-asset/import.png"
                justify="justify-center"
                px="4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Table tampil di semua ukuran layar */}
      <div className="">
        <TablePemeliharaan kategori={selectedKategori} tanggal={selectedDate} />
      </div>
    </>
  );
}
