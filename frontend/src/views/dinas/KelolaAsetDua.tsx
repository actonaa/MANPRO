import Layout from "../../components/contanct/Layout";
import CardImg from "../../components/card/CardImg";
import AssetSummary from "../../components/kelola-asset/AssetSummary";
import { useNavigate } from "react-router-dom";

export default function Aset() {
  const navigate = useNavigate();

  const handleExport = () => {
    console.log("Export data aset...");
    // logika export file bisa kamu taruh di sini
  };

  const handleNavigate = () => {
    navigate("/tambah-aset");
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

      <div>
        <AssetSummary />
      </div>
    </Layout>
  );
}
