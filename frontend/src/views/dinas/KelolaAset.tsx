import Layout from "../../components/contanct/Layout";
import CardImg from "../../components/card/CardImg";
import AssetSummary from "../../components/kelola-asset/AssetSummary";
import { useNavigate } from "react-router-dom";
import FilterDate from "../../components/filter/FilterDate";
import Filter from "../../components/filter/Filter";

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
      <h1 className="font-medium text-sm mb-4">Kelola Aset</h1>
      <div className="flex gap-2 mb-5">
        <div className="w-[27%]">
          <CardImg
            title="Export"
            img="/img/kelola-asset/export.png"
            justify="justify-center"
            onClick={handleExport}
          />
        </div>
        <div className="w-[27%]">
          <CardImg
            title="Import"
            img="/img/kelola-asset/import.png"
            justify="justify-center"
          />
        </div>
        <div className="w-[46%]">
          <CardImg
            title="Tambah Aset"
            img="/img/kelola-asset/tambah-asset.png"
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

      <div className="mb-5">
        <AssetSummary />
      </div>

      <div className="flex gap-3">
        <FilterDate />
        <Filter
          label="Kategori"
          options={["Aset TI", "Aset Non TI"]}
          onSelect={handleKategoriChange}
        />
        <Filter
          label="Status"
          options={["Aktif", "Perbaikan", "Tidak Aktif"]}
          onSelect={handleStatusChange}
        />
      </div>
    </Layout>
  );
}
