import { useState } from "react";
import { X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void; // ✅ Tambahkan ini
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("CSV");

  if (!isOpen) return null;

  // === Fungsi utama untuk mendownload ===
  const handleExport = (format: string) => {
    let fileContent = "";
    let mimeType = "";
    let fileName = "";

    switch (format) {
      case "CSV":
        fileContent =
          "ID,Name,Category\n1,Laptop,Aset TI\n2,Printer,Aset Non TI";
        mimeType = "text/csv";
        fileName = "data-aset.csv";
        break;
      case "PDF":
        fileContent = "Ini adalah contoh export PDF (dummy)";
        mimeType = "application/pdf";
        fileName = "data-aset.pdf";
        break;
      case "XLSX":
        fileContent = "Ini adalah contoh export Excel (dummy)";
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileName = "data-aset.xlsx";
        break;
      default:
        return;
    }

    // Buat blob file
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Buat link download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    // Bersihkan URL dan tutup modal
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-lg p-5 animate-fadeIn">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Export Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== Body ===== */}
        <p className="text-sm text-gray-600 mb-4">
          Pilih format export terlebih dahulu.
        </p>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Format File
          </p>
          <div className="flex justify-between gap-3">
            {["CSV", "PDF", "XLSX"].map((format) => (
              <label
                key={format}
                className={`flex-1 flex items-center justify-center border rounded-full py-2 text-sm font-medium cursor-pointer transition ${
                  selectedFormat === format
                    ? "bg-blue-50 border-[#0095E8] text-[#0095E8]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={format}
                  checked={selectedFormat === format}
                  onChange={() => setSelectedFormat(format)}
                  className="hidden"
                />
                {format}
              </label>
            ))}
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="flex w-full gap-3 border-t border-gray-200/70 pt-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition"
          >
            Batal
          </button>
          <button
            onClick={() => handleExport(selectedFormat)}
            className="w-full py-2 rounded-full bg-[#0095E8] hover:bg-[#007ACC] text-white font-medium text-sm transition"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
