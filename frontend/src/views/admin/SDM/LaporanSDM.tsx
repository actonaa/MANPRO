import { useState, useMemo } from "react";
import FilterDinas from "../../../components/button/FilterDinas";
import FilterDate from "../../../components/filter/FilterDate";
import TabelSDM from "../../../components/table/LaporanSDMAdmin";
import SearchBar from "../../../components/filter/Search";

interface SDM {
  nip: string;
  nama: string;
  jabatan: string;
  dinas: string;
  periodeKerja: string;
}

const initialData: SDM[] = [
  {
    nip: "22051214116",
    nama: "Cinta Laura",
    jabatan: "Manajer Aset",
    dinas: "Diskominfo",
    periodeKerja: "02/10/2025 - 02/10/2026",
  },
  {
    nip: "22051214115",
    nama: "Lana Del Rey",
    jabatan: "Kepala Departemen",
    dinas: "Dispendik",
    periodeKerja: "10/12/2025 - 10/12/2026",
  },
  {
    nip: "22051214129",
    nama: "Selena Gomez",
    jabatan: "Staf Aset",
    dinas: "Disbudpora",
    periodeKerja: "10/12/2025 - 10/12/2026",
  },
];

// =====================
// 📌 Helper tanggal
// =====================
const parseDDMMYYYY = (str: string) => {
  const [d, m, y] = str.split("/");
  return new Date(`${y}-${m}-${d}`);
};

const parseYYYYMMDD = (str: string) => {
  const [y, m, d] = str.split("-");
  return new Date(`${y}-${m}-${d}`);
};

export default function LaporanSdmAdmin() {
  // ===== STATE FILTER =====
  const [search, setSearch] = useState("");
  const [filterDinas, setFilterDinas] = useState("");
  const [filterPeriode, setFilterPeriode] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // ===== HANDLERS =====
  const handleSearch = (val: string) => setSearch(val);
  const handleDinasChange = (val: string) => setFilterDinas(val);
  const handlePeriodeChange = (range: { start: string; end: string }) =>
    setFilterPeriode(range);

  // =====================
  // 📌 FINAL FILTERING
  // =====================
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // 1) SEARCH
      const matchSearch =
        item.nip.toLowerCase().includes(search.toLowerCase()) ||
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(search.toLowerCase());

      // 2) DINAS
      const matchDinas = filterDinas
        ? item.dinas.toLowerCase() === filterDinas
        : true;

      // 3) PERIODE
      let matchPeriode = true;

      if (filterPeriode?.start && filterPeriode?.end) {
        const filterStart = parseYYYYMMDD(filterPeriode.start);
        const filterEnd = parseYYYYMMDD(filterPeriode.end);

        const [pStart, pEnd] = item.periodeKerja.split(" - ");
        const startDate = parseDDMMYYYY(pStart);
        const endDate = parseDDMMYYYY(pEnd);

        // cek overlap range
        matchPeriode = startDate <= filterEnd && endDate >= filterStart;
      }

      return matchSearch && matchDinas && matchPeriode;
    });
  }, [search, filterDinas, filterPeriode]);

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="mb-5">
        <h1 className="font-semibold text-[22px] md:text-2xl lg:text-[28px]">
          Laporan Data Sumber Daya Manusia
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau seluruh data SDM yang tercatat
        </p>
      </div>

      {/* ===== FILTER SECTION ===== */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Cari SDM</p>
            <SearchBar onChange={handleSearch} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dinas</p>
            <FilterDinas onSelect={handleDinasChange} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate onSelect={handlePeriodeChange} />
          </div>
        </div>

        {/* ===== MOBILE RESPONSIVE ===== */}
        <div className="grid grid-cols-1 gap-4 md:hidden mt-2">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Cari SDM</p>
            <SearchBar onChange={handleSearch} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dinas</p>
            <FilterDinas onSelect={handleDinasChange} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate onSelect={handlePeriodeChange} />
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <TabelSDM data={filteredData} />
    </>
  );
}
