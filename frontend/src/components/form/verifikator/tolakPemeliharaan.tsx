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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 text-center animate-fadeIn">
        {/* Ikon */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 p-3 rounded-full">
            <CircleHelp className="text-red-500 w-6 h-6" />
          </div>
        </div>

        {/* Judul */}
        <h2 className="text-lg font-semibold text-gray-800">
          Konfirmasi Penolakan Risiko
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Risiko akan dikirim kembali kepada pengguna dinas untuk diperbaiki
        </p>

        {/* Detail Risiko */}
        <div className="text-left text-sm mt-4 space-y-2 border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <p className="text-gray-500">Nama Risiko</p>
            <p className="font-semibold text-gray-800">{namaRisiko}</p>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <p className="text-gray-500">Aset Terkait</p>
            <p className="font-semibold text-gray-800">{asetTerkait}</p>
          </div>
        </div>

        {/* Pertanyaan */}
        <p className="font-medium text-gray-700 mt-4 mb-4">
          Apakah anda yakin?
        </p>

        {/* Tombol */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasiPenolakanRisiko;
