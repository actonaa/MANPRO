import React, { useState } from "react";
import { CircleHelp } from "lucide-react";

interface KonfirmasiPenolakanRisikoProps {
  namaRisiko: string;
  asetTerkait: string;
  onCancel?: () => void;
  onConfirm?: (notes: string) => void; // <--- kirim catatan ke parent
  loading?: boolean; // optional untuk state loading
}

const KonfirmasiPenolakanRisiko: React.FC<KonfirmasiPenolakanRisikoProps> = ({
  namaRisiko,
  asetTerkait,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!notes.trim()) return;
    onConfirm?.(notes);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-[90%] sm:max-w-md mx-auto text-center">
      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div className="bg-red-100 p-3 rounded-full">
          <CircleHelp className="text-red-500 w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        Konfirmasi Penolakan Risiko
      </h2>
      <p className="text-gray-600 text-xs sm:text-sm mt-1">
        Risiko akan dikembalikan kepada pengguna dinas untuk diperbaiki.
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

      {/* Textarea Revisi */}
      <div className="mt-4 text-left">
        <label className="text-sm text-gray-700 font-medium">
          Catatan Revisi <span className="text-red-500">*</span>
        </label>
        <textarea
          className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-red-500 focus:border-red-500"
          rows={3}
          placeholder="Masukkan alasan penolakan..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm sm:text-base"
        >
          Batal
        </button>

        <button
          onClick={handleSubmit}
          disabled={!notes.trim() || loading}
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-white text-sm sm:text-base transition
            ${
              !notes.trim() || loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800"
            }
          `}
        >
          {loading ? "Memproses..." : "Tolak"}
        </button>
      </div>
    </div>
  );
};

export default KonfirmasiPenolakanRisiko;
