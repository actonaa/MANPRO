import Layout from "../../components/contanct/Layout";
import ButtonImg from "../../components/button/ButtonImg";
import { useNavigate } from "react-router-dom";
import FilterDate from "../../components/filter/FilterDate";
import ButtonFilter from "../../components/button/ButtonFilter";
import CardList from "../../components/card/CardList";
import TableAset from "../../components/table/TableAset";

export default function Aset() {
  const navigate = useNavigate();

  const handleExport = () => {
    console.log("Export data aset...");
  };

  const handleNavigate = () => {
    navigate("/tambah-aset");
  };

  const handleStatusChange = (val: string) => {
    console.log("Status dipilih:", val);
  };

  const handleKategoriChange = (val: string) => {
    console.log("Kategori dipilih:", val);
  };

  return (
    <Layout>
      <h1 className="font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Kelola Aset
      </h1>
      <div className="flex gap-2 mb-5 md:hidden">
        <div className="w-[27%]">
          <ButtonImg
            title="Export"
            img="/kelola-asset/export.png"
            justify="justify-center"
            onClick={handleExport}
          />
        </div>
        <div className="w-[27%]">
          <ButtonImg
            title="Import"
            img="/kelola-asset/import.png"
            justify="justify-center"
          />
        </div>
        <div className="w-[46%]">
          <ButtonImg
            title="Tambah Aset"
            img="/kelola-asset/tambah-asset.png"
            color="#00a9ff"
            hoverColor="#a0e9ff"
            borderColor="#00a9ff"
            textColor="white"
            px="2"
            fontWeight="font-medium"
            onClick={handleNavigate}
          />
        </div>
      </div>

      <div className="mb-5 overflow-x-auto pb-6 md:pb-0 md:overflow-x-visible">
        <div className="flex gap-4 min-w-[1000px] md:grid md:grid-cols-2 md:min-w-0 lg:flex lg:min-w-[1000px]">
          <CardList title="Total Aset" value="1,250" />
          <CardList title="Aset Perlu Perbaikan" value="560" />
          <CardList title="Aset Akan Dihapus" value="200" />
          <CardList title="Total Nilai Aset" value="Rp. 2,5M" />
        </div>
      </div>

      <div className="flex gap-3 md:hidden">
        <FilterDate />
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
      </div>

      {/* Responsive Laptop */}
      <h1 className="hidden md:block font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Data Aset
      </h1>

      <div className="hidden md:block shadow-xl bg-white rounded-t-[12px]">
        <div className="border-b border-[#ddd]">
          <div className="flex justify-between p-8">
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
            </div>
            <div className="flex gap-3">
              <ButtonImg
                title="Export"
                img="/kelola-asset/export.png"
                justify="justify-center"
                onClick={handleExport}
                px="4"
              />
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

        <div>
          <TableAset />
        </div>
      </div>
    </Layout>
  );
}
