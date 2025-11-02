import ButtonImg from "../../components/button/ButtonImg";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import CardList from "../../components/card/CardList";
import TableAset from "../../components/table/TableAset";

export default function Aset() {
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
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Kelola Aset
      </h1>
      <div className="flex gap-2 mb-5 md:hidden items-start justify-start">
        <div className="w-full">
          <ButtonImg
            title="Export"
            img="/kelola-asset/export.png"
            justify="justify-center"
          />
        </div>
      </div>

      <div className="mb-5 overflow-x-auto pb-6 md:mb-0 xl:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 xl:flex">
          <CardList title="Total Aset" value="1,250" />
          <CardList title="Aset Perlu Perbaikan" value="560" />
          <CardList title="Aset Akan Dihapus" value="200" />
          <CardList title="Total Nilai Aset" value=" Rp. 2,5M" />
        </div>
      </div>

      <div className="flex flex-nowrap md:hidden items-center justify-between w-full gap-2">
        {/* 📅 Filter Tanggal */}
        <div className="flex-1 min-w-0 relative z-[40]">
          <FilterDate />
        </div>

        {/* 🧩 Kategori */}
        <div className="flex-1 min-w-0 relative z-[40]">
          <ButtonFilter
            label="Kategori"
            options={["Aset TI", "Aset Non TI"]}
            onSelect={handleKategoriChange}
          />
        </div>

        {/* ⚙️ Status */}
        <div className="flex-1 min-w-0 relative z-[40]">
          <ButtonFilter
            label="Status"
            options={["Aktif", "Perbaikan", "Tidak Aktif"]}
            onSelect={handleStatusChange}
          />
        </div>

        {/* 🏛️ Dinas */}
        <div className="flex-1 min-w-0 relative z-[40]">
          <ButtonFilter
            label="Dinas"
            options={[
              "Kesehatan",
              "Pendidikan",
              "Kebudayaan",
              "Perhubungan",
              "Lingkungan Hidup",
            ]}
            onSelect={handleDinasChange}
          />
        </div>
      </div>

      {/* Responsive Laptop */}
      <h1 className="hidden md:block font-medium text-sm lg:mb-4 md:text-2xl lg:text-[28px]">
        Data Aset
      </h1>

      {/* Hanya bagian filter dan tombol yang disembunyikan di mobile */}
      <div className="hidden md:block lg:bg-white rounded-t-xl">
        <div className="lg:border-b border-[#ddd]">
          <div className="flex justify-between px-0 lg:px-4 py-8">
            <div className="flex gap-3">
              <ButtonFilter
                label="Kategori"
                options={["Aset TI", "Aset Non TI"]}
                onSelect={handleKategoriChange}
              />
              <ButtonFilter
                label="Status"
                options={["Aktif", "Perbaikan", "Tidak Aktif"]}
                onSelect={handleStatusChange}
              />

              <FilterDate />

              <div className="flex items-center">
                <div className="w-[210px]">
                  <ButtonFilter
                    label="Pilih Dinas"
                    options={[
                      "Dinas Kesehatan",
                      "Dinas Pendidikan",
                      "Dinas Kebudayaan",
                      "Dinas Perhubungan",
                      "Dinas Lingkungan Hidup",
                    ]}
                    onSelect={(val) => console.log("Dinas dipilih:", val)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ButtonImg
                title="Export"
                img="/kelola-asset/export.png"
                justify="justify-center"
                px="4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table tampil di semua ukuran layar */}
      <div className=" rounded-xl md:rounded-none md:rounded-b-xl">
        <TableAset />
      </div>
    </>
  );
}
