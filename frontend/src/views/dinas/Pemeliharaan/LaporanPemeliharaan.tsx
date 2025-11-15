import { useState } from "react";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import TablePemeliharaan from "../../../components/table/TablePemeliharaan";
import { Search } from "lucide-react";

export default function Pemeliharaan() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleKategoriChange = (val: string) => setSelectedKategori(val);

  return (
    <>
      {/* 🏷️ Judul Halaman */}
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Pemeliharaan
      </h1>

      {/* 📊 Kartu Statistik */}
      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList title="Total Pemeliharaan" value="1,250" />
          <CardList title="Pemeliharaan Berhasil" value="560" />
          <CardList title="Insiden" value="200" />
          <CardList title="Total Harga" value="Rp. 2,5M" />
        </div>
      </div>

      {/* 📱 Filter MOBILE */}
      <div className="flex gap-3 md:hidden">
        {/* 🔍 Search */}
        <div className="relative w-full h-[42px]  bg-white mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari pemeliharaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-10 pr-3 border border-gray-300 rounded-lg text-sm
                       focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Tanggal */}
      <div className="h-[44px]">
        <FilterDate
          onSelect={(val) => {
            setSelectedDate(`${val.start} - ${val.end}`);
          }}
        />
      </div>
      {/* Jenis */}
      <div className="h-[42px]">
        <ButtonFilter
          label="Jenis"
          options={["Terjadwal", "Insidental"]}
          onSelect={handleKategoriChange}
        />
      </div>

      </div>
      {/* 💻 Filter DESKTOP */}
      <div className="hidden md:block lg:bg-white rounded-t-xl">
        <div className="lg:border-b border-[#ddd]">
          <div className="flex justify-between px-0 lg:px-4 py-8">
            <div className="flex gap-3 items-center w-full max-w-2xl">
              {/* 🔍 Search */}
              <div className="relative w-full h-[44px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pemeliharaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-10 pr-3 border border-gray-300 rounded-lg text-sm
                             focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Jenis */}
              <div className="h-[44px]">
                <ButtonFilter
                  label="Jenis"
                  options={["Terjadwal", "Insidental"]}
                  onSelect={handleKategoriChange}
                />
              </div>

              {/* Tanggal */}
              <div className="h-[44px]">
                <FilterDate
                  onSelect={(val) => {
                    setSelectedDate(`${val.start} - ${val.end}`);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Table tampil */}
      <div>
        <TablePemeliharaan
          kategori={selectedKategori}
          tanggal={selectedDate}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
}
