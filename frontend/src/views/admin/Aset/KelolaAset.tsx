import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import TableAsetAdmin from "../../../components/table/TableAsetAdmin";
import type { AsetItem } from "../../../components/table/TableAsetAdmin";
import { Search } from "lucide-react";
import { useState } from "react";

export default function AsetAdmin() {
  const [search, setSearch] = useState("");

  // ====== DATA ASET (DI-PERBAIKI) ======
  const dataAset = [
    {
      id: 1,
      kode_aset: "AST - 001",
      nama_aset: "CCTV Lobby",
      kategori: "TI",
      lokasi: "Kantor Pusat",
      status_aset: "Aktif",
      status_pengajuan: "Diterima",
      tanggal_perolehan: "12 - 01 - 2025",
      dinas: "DISPORA",
    },
    {
      id: 2,
      kode_aset: "AST - 002",
      nama_aset: "Mobil Operasional",
      kategori: "NON-TI",
      lokasi: "Garasi",
      status_aset: "Perbaikan",
      status_pengajuan: "Menunggu",
      tanggal_perolehan: "12 - 01 - 2025",
      dinas: "DISPENDIK",
    },
    {
      id: 3,
      kode_aset: "AST - 003",
      nama_aset: "Laptop Asus Zenbook",
      kategori: "TI",
      lokasi: "Ruang Server",
      status_aset: "Tidak Aktif",
      status_pengajuan: "Ditolak",
      tanggal_perolehan: "12 - 01 - 2025",
      dinas: "DISPORA",
    },
  ] as const satisfies AsetItem[];

  // ===== FILTER HANDLER =====
  const handleStatusChange = (val: string) => console.log("Status:", val);
  const handleKategoriChange = (val: string) => console.log("Kategori:", val);
  const handleDinasChange = (val: string) => console.log("Dinas:", val);

  return (
    <>
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Kelola Aset
      </h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="mb-5 overflow-x-auto pb-4 md:pb-6">
        <div
          className="
            flex gap-4 min-w-[800px]
            sm:grid sm:grid-cols-2 sm:min-w-0
            lg:grid-cols-4
          "
        >
          <CardList title="Total Aset" value="1,250" />
          <CardList title="Aset Perlu Perbaikan" value="560" />
          <CardList title="Aset Akan Dihapus" value="200" />
          <CardList title="Risiko Aktif" value="499" />
        </div>
      </div>

      {/* ===== FILTER SECTION ===== */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        {/* === SEARCH BAR (Mobile & Desktop) === */}
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 w-[400px] mb-5">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari nama aset / kode aset..."
            className="w-full bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* MOBILE */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dinas</p>
            <ButtonFilter
              label="Dinas"
              options={[
                "Dinas Pariwisata",
                "Dinas Pendidikan",
                "Dinas Komunikasi",
              ]}
              onSelect={handleDinasChange}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Kategori</p>
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Aset Non TI"]}
              onSelect={handleKategoriChange}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <ButtonFilter
              label="Status"
              options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              onSelect={handleStatusChange}
            />
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dinas</p>
            <ButtonFilter
              label="Dinas"
              options={[
                "Dinas Pariwisata",
                "Dinas Pendidikan",
                "Dinas Komunikasi",
              ]}
              onSelect={handleDinasChange}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Kategori</p>
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Aset Non TI"]}
              onSelect={handleKategoriChange}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <ButtonFilter
              label="Status"
              options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              onSelect={handleStatusChange}
            />
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="rounded-xl md:rounded-none md:rounded-b-xl">
        <TableAsetAdmin data={dataAset} />
      </div>
    </>
  );
}
