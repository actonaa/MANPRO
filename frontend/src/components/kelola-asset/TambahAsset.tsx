import { useNavigate } from "react-router-dom";

export default function TambahAssetButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tambah-aset");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 bg-[#007DFA] text-white font-medium px-2 py-3 rounded-lg hover:bg-secondary transition-all duration-300"
    >
      <img
        src="/img/kelola-asset/tambah-aset.png"
        alt="Tambah Aset"
        className="w-5 h-5 font-bold"
      />
      <span className="text-sm">Tambah Aset</span>
    </button>
  );
}
