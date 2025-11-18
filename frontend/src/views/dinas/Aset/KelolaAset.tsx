/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Search } from "lucide-react"; // <-- ICON SEARCH
import ButtonImg from "../../../components/button/ButtonImg";
import { useNavigate } from "react-router-dom";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import TableAset from "../../../components/table/TableAset";

export default function Aset() {
  const [assets, setAssets] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/assets", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data (${res.status})`);
        }

        const data = await res.json();
        setAssets(data); // ⬅️ Simpan data aset
      } catch (err) {
        console.error("❌ Gagal memuat data:", err);
      }
    };

    getData();
  }, []);

  // 🔢 Hitung statistik
  const totalAset = assets.length;

  const asetPerluPerbaikan = assets.filter(
    (item) => item.status?.name === "Perbaikan"
  ).length;

  const asetAkanDihapus = assets.filter(
    (item) => item.status?.name === "Tidak Aktif"
  ).length;

  const nilaiAset = assets.reduce(
    (total, item) => total + (item.acquisition_value || 0),
    0
  );

  // 🔹 State untuk filter
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleNavigate = () => {
    navigate("/aset/tambah");
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val === "Status" ? "" : val);
  };

  const handleKategoriChange = (val: string) => {
    setSelectedKategori(val === "Kategori" ? "" : val);
  };

  return (
    <>
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Kelola Aset
      </h1>

      {/* 📱 Tombol Import & Tambah (Mobile) */}
      <div className="flex gap-2 mb-5 md:hidden items-start justify-start">
        <div className="w-full">
          <ButtonImg
            title="Import"
            img="/kelola-asset/import.png"
            justify="justify-center"
          />
        </div>
        <div className="w-full">
          <ButtonImg
            title="Tambah Aset"
            img="/kelola-asset/tambah-asset.png"
            color="#00a9ff"
            hoverColor="#a0e9ff"
            borderColor="#00a9ff"
            textColor="white"
            px="2"
            fontWeight="font-medium"
            wFull="w-auto"
            paddingY="py-0"
            onClick={handleNavigate}
          />
        </div>
      </div>

      {/* 📊 Card Statistik */}
      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList title="Total Aset" value={totalAset.toLocaleString()} />

          <CardList
            title="Aset Perlu Perbaikan"
            value={asetPerluPerbaikan.toLocaleString()}
          />

          <CardList
            title="Aset Akan Dihapus"
            value={asetAkanDihapus.toLocaleString()}
          />

          <CardList
            title="Nilai Aset"
            value={
              "Rp " +
              nilaiAset.toLocaleString("id-ID", {
                minimumFractionDigits: 0,
              })
            }
          />
        </div>
      </div>

      {/* 🔎 Search Filter (MOBILE) */}
      <div className="md:hidden mb-3 relative bg-white">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari aset..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full text-sm pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* 📱 Filter di Mobile */}
      <div className="flex gap-3 md:hidden">
        <FilterDate />
        <ButtonFilter
          label="Kategori"
          options={["Kategori", "TI", "Non-TI"]}
          onSelect={handleKategoriChange}
        />
        <ButtonFilter
          label="Status"
          options={["Status", "Aktif", "Perbaikan", "Tidak Aktif"]}
          onSelect={handleStatusChange}
        />
      </div>

      {/* 💻 Filter di Desktop */}

      <div className="hidden md:block lg:bg-white rounded-t-xl">
        <div className="lg:border-b border-[#ddd]">
          <div className="px-0 lg:px-4 py-8">
            <h1 className="hidden md:block font-medium text-sm lg:mb-4 md:text-2xl lg:text-[17px] lg:font-semibold">
              Data Aset
            </h1>

            {/* 🔎 Search Filter (DESKTOP) */}
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

            <div className="flex justify-between">
              <div className="flex gap-3">
                <ButtonFilter
                  label="Kategori"
                  options={["Kategori", "TI", "Non-TI"]}
                  onSelect={handleKategoriChange}
                />
                <ButtonFilter
                  label="Status"
                  options={["Status", "Aktif", "Perbaikan", "Tidak Aktif"]}
                  onSelect={handleStatusChange}
                />
                <FilterDate />
              </div>

              <div className="flex gap-3">
                <ButtonImg
                  title="Import"
                  img="/kelola-asset/import.png"
                  justify="justify-center"
                  px="4"
                />
                <ButtonImg
                  title="Tambah Aset"
                  img="/kelola-asset/tambah-asset.png"
                  color="#00a9ff"
                  hoverColor="#a0e9ff"
                  borderColor="#00a9ff"
                  textColor="white"
                  px="6"
                  fontWeight="font-medium"
                  onClick={handleNavigate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Tabel Data */}
      <div className="rounded-xl md:rounded-none md:rounded-b-xl">
        <TableAset
          selectedKategori={selectedKategori}
          selectedStatus={selectedStatus}
          searchValue={searchValue}
        />
      </div>
    </>
  );
}
