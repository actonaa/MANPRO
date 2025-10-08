import { useNavigate } from "react-router-dom";
import tambahAssetIcon from "../../img/kelola-asset/tambah-asset.png";

export default function TambahAssetButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tambah-aset");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition-all duration-300"
    >
      <img
        src={tambahAssetIcon}
        alt="Tambah Aset"
        className="w-5 h-5 object-contain"
      />
      <span>Tambah Aset</span>
    </button>
  );
}
