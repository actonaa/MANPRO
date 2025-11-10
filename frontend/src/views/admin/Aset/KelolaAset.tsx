import { useNavigate } from "react-router-dom";
import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import TableAset from "../../../components/table/TableAset";

export default function Aset() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/aset/tambah");
  };

  const handleStatusChange = (val: string) => {
    console.log("Status dipilih:", val);
  };

  const handleKategoriChange = (val: string) => {
    console.log("Kategori dipilih:", val);
  };

  const handleDinasChange = (val: string) => {
    console.log("Dinas dipilih:", val);
  };

  return (
    <>
      {/* ===== HEADER ===== */}
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
        {/* MOBILE LAYOUT */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {/* Dinas */}
          <div className="flex flex-col">
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

          {/* Periode */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate />
          </div>

          {/* Kategori */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 mb-1">Kategori</p>
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Aset Non TI"]}
              onSelect={handleKategoriChange}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <ButtonFilter
              label="Status"
              options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              onSelect={handleStatusChange}
            />
          </div>
        </div>

        {/* DESKTOP & TABLET LAYOUT */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          {/* Dinas */}
          <div className="flex flex-col">
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

          {/* Periode */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate />
          </div>

          {/* Kategori */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 mb-1">Kategori</p>
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Aset Non TI"]}
              onSelect={handleKategoriChange}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <ButtonFilter
              label="Status"
              options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              onSelect={handleStatusChange}
            />
          </div>
        </div>
      </div>

      {/* Table tampil di semua ukuran layar */}
      <div className="rounded-xl md:rounded-none md:rounded-b-xl">
        <TableAset />
      </div>
    </>
  );
}
