import exportIcon from "../../img/kelola-asset/export.png";

export default function ExportButton() {
  const handleExport = () => {
    console.log("Export data aset...");
  };

  return (
    <button
      onClick={handleExport}
      className="
        flex items-center justify-center sm:justify-between gap-2
        border border-gray-300 rounded-lg 
        px-3 sm:px-4 py-2 
        bg-white hover:bg-gray-50 active:scale-[0.98] 
        transition-all duration-200 shadow-sm 
        w-full sm:w-auto
      "
    >
      <img
        src={exportIcon}
        alt="Export"
        className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-80"
      />
      <span className="text-gray-600 text-sm sm:text-base ">Export</span>
    </button>
  );
}
