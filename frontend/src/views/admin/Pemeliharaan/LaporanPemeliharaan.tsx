import { useState } from "react";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import { Download } from "lucide-react";
import ExportModal from "../../../components/dropdown/Export";
import TablePemeliharaanAdmin from "../../../components/table/TablePemeliharaanAdmin";

export default function PemeliharaanAdmin() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // 🌈 state untuk ubah warna tombol

  const handleStatusChange = (val: string) => setSelectedStatus(val);
  const handleKategoriChange = (val: string) => setSelectedKategori(val);

  return (
    <>
      {/* 🏷️ Judul Halaman */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-medium text-sm md:text-2xl lg:text-[28px] text-gray-800">
          Pemeliharaan
        </h1>
      </div>

      {/* 📱 Tombol Export (mobile) */}
      <div className="block lg:hidden w-full mb-4">
        <button
          onClick={() => setIsExportOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-md border transition ${
            isHovered
              ? "bg-gray-100 border-gray-300 text-gray-700"
              : "bg-white border-gray-200 text-gray-600"
          }`}
        >
          <Download className="w-4 h-4 text-gray-500" />
          Export
        </button>
      </div>

      {/* 📊 Statistik */}
      <div className="mb-5 pb-6 lg:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardList title="Total Pemeliharaan" value="1,250" />
          <CardList title="Pemeliharaan Berhasil" value="560" />
          <CardList title="Insiden" value="200" />
          <CardList title="Total Harga" value="Rp. 2,5M" />
        </div>
      </div>

      {/* 🎯 Filter Bar */}
      <div className="border-b bg-white rounded-t-xl border-[#ddd] px-4 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
          <div className="w-full sm:w-auto">
            <FilterDate
              onSelect={(val) => setSelectedDate(`${val.start} - ${val.end}`)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <ButtonFilter
              label="Kategori"
              options={["Terjadwal", "Insidental"]}
              onSelect={handleKategoriChange}
            />
          </div>
          <div className="w-full sm:w-auto">
            <ButtonFilter
              label="Status"
              options={["Selesai", "Berlangsung", "Dibatalkan"]}
              onSelect={handleStatusChange}
            />
          </div>
        </div>

        {/* 💾 Tombol Export (desktop) */}
        <div className="hidden lg:flex">
          <button
            onClick={() => setIsExportOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md border transition ${
              isHovered
                ? "bg-gray-100 border-gray-300 text-gray-700"
                : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            <Download className="w-4 h-4 text-gray-500" />
            Export
          </button>
        </div>
      </div>

      {/* 📋 Tabel / Card Data */}
      <div className="">
        <TablePemeliharaanAdmin
          kategori={selectedKategori}
          status={selectedStatus}
          tanggal={selectedDate}
        />
      </div>

      {/* 🪟 Modal Export */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </>
  );
}
