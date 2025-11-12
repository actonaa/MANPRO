import React from "react";
import { CircleHelp } from "lucide-react";

interface ModalKonfirmasiPenolakanRisikoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  namaRisiko: string;
  asetTerkait: string;
}

const ModalKonfirmasiPenolakanRisiko: React.FC<
  ModalKonfirmasiPenolakanRisikoProps
> = ({ open, onClose, onConfirm, namaRisiko, asetTerkait }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 sm:px-4">
      <div
        className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md 
        text-center animate-fadeIn overflow-hidden"
      >
        {/* Ikon */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 p-3 rounded-full">
            <CircleHelp className="text-red-500 w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Judul */}
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Konfirmasi Penolakan Risiko
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Risiko akan dikirim kembali kepada pengguna dinas untuk diperbaiki.
        </p>

        {/* Detail Risiko */}
        <div className="text-left text-xs sm:text-sm mt-4 space-y-2 border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <p className="text-gray-500">Nama Risiko</p>
            <p className="font-semibold text-gray-800 text-right">
              {namaRisiko}
            </p>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <p className="text-gray-500">Aset Terkait</p>
            <p className="font-semibold text-gray-800 text-right">
              {asetTerkait}
            </p>
          </div>
        </div>

        {/* Pertanyaan */}
        <p className="font-medium text-gray-700 mt-4 mb-3 sm:mb-4 text-sm sm:text-base">
          Apakah Anda yakin?
        </p>

        {/* Tombol */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition text-sm sm:text-base"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition text-sm sm:text-base"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasiPenolakanRisiko;
