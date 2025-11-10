import { useState } from "react";
import { X, Upload } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export default function ImportModal({
  isOpen,
  onClose,
  onImport,
}: ImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu!");
      return;
    }
    onImport(selectedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-lg p-5 animate-fadeIn">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Impor Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== Body ===== */}
        <p className="text-sm text-gray-600 mb-4">
          Pilih file CSV atau Excel untuk mengimpor data aset.
        </p>

        <div className="mb-6 border border-gray-200/80 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Upload className="w-8 h-8 text-[#0095E8] mb-2" />
          <p className="text-sm text-gray-700 mb-2">
            {selectedFile ? (
              <span className="font-medium text-gray-900">
                {selectedFile.name}
              </span>
            ) : (
              "Belum ada file dipilih"
            )}
          </p>
          <label className="cursor-pointer bg-[#0095E8] hover:bg-[#007ACC] text-white text-sm font-medium px-4 py-2 rounded-full transition">
            Pilih File
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* ===== Footer ===== */}
        <div className="flex w-full gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition"
          >
            Batal
          </button>
          <button
            onClick={handleImport}
            className="w-full py-2 rounded-full bg-[#0095E8] hover:bg-[#007ACC] text-white font-medium text-sm transition"
          >
            Impor
          </button>
        </div>
      </div>
    </div>
  );
}
