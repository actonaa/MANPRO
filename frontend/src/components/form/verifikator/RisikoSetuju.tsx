import React, { useState } from "react";
import { CircleHelp } from "lucide-react";

interface KonfirmasiPersetujuanRisikoProps {
  namaRisiko: string;
  asetTerkait: string;
  onCancel?: () => void;
  onConfirm?: () => Promise<void>;
  loading?: boolean;
}

const KonfirmasiPersetujuanRisiko: React.FC<
  KonfirmasiPersetujuanRisikoProps
> = ({ namaRisiko, asetTerkait, onCancel, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    setLoading(true); // mulai loading
    try {
      await onConfirm(); // panggil fungsi parent
    } finally {
      setLoading(false); // selesai loading
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-[90%] sm:max-w-md mx-auto text-center">
      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <CircleHelp className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        Konfirmasi Persetujuan Risiko
      </h2>
      <p className="text-gray-600 text-xs sm:text-sm mt-1">
        Risiko ini akan disetujui.
      </p>

      {/* Detail Info */}
      <div className="text-left text-xs sm:text-sm mt-4 space-y-2 border-t border-gray-200 pt-3">
        <div className="flex justify-between">
          <p className="text-gray-500">Nama Risiko</p>
          <p className="font-semibold text-gray-800 text-right max-w-[50%] break-words">
            {namaRisiko}
          </p>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <p className="text-gray-500">Aset Terkait</p>
          <p className="font-semibold text-gray-800 text-right max-w-[50%] break-words">
            {asetTerkait}
          </p>
        </div>
      </div>

      {/* Question */}
      <p className="font-medium text-gray-700 mt-4 mb-4 text-sm sm:text-base">
        Apakah anda yakin?
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Setuju & Aktifkan"}
        </button>
      </div>
    </div>
  );
};

export default KonfirmasiPersetujuanRisiko;
