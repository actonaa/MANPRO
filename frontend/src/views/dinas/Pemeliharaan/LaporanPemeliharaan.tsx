/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import TablePemeliharaan from "../../../components/table/TablePemeliharaan";
import { Search } from "lucide-react";

export default function Pemeliharaan() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔢 State Statistik
  const [totalPemeliharaan, setTotalPemeliharaan] = useState(0);
  const [pemeliharaanBerhasil, setPemeliharaanBerhasil] = useState(0);
  const [totalInsiden, setTotalInsiden] = useState(0);
  const [totalHarga, setTotalHarga] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleKategoriChange = (val: string) => setSelectedKategori(val);

  // 📌 Fetch statistik dari API maintenance
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/maintenance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        // 📊 Hitung Statistik
        setTotalPemeliharaan(data.length);

        setPemeliharaanBerhasil(
          data.filter((item: any) => item.status === "selesai").length
        );

        setTotalInsiden(
          data.filter((item: any) => item.type === "insidental").length
        );

        // 💰 Total Harga (cost)
        setTotalHarga(
          data.reduce((sum: number, item: any) => sum + (item.cost || 0), 0)
        );
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* 🏷️ Judul Halaman */}
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Pemeliharaan
      </h1>

      {/* 📊 Kartu Statistik */}
      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList
            title="Total Pemeliharaan"
            value={totalPemeliharaan}
            loading={loading}
          />
          <CardList
            title="Pemeliharaan Berhasil"
            value={pemeliharaanBerhasil}
            loading={loading}
          />
          <CardList title="Insiden" value={totalInsiden} loading={loading} />
          <CardList
            title="Total Harga"
            value={`Rp ${totalHarga.toLocaleString("id-ID")}`}
            loading={loading}
          />
        </div>
      </div>

      {/* 📱 Filter MOBILE */}
      <div className="flex gap-3 md:hidden">
        {/* 🔍 Search */}
        <div className="relative w-full h-[42px] bg-white mb-2">
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
