import React from "react";
import { CircleHelp } from "lucide-react";

interface KonfirmasiPenolakanProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

const KonfirmasiPenolakan: React.FC<KonfirmasiPenolakanProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto text-center">
      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div className="bg-red-100 p-3 rounded-full">
          <CircleHelp className="text-red-500 w-6 h-6" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800">
        Konfirmasi Penolakan
      </h2>
      <p className="text-gray-600 text-sm mt-1">
        Aset akan dikirim kembali kepada pengguna dinas untuk diperbaiki
      </p>

      {/* Divider */}
      <hr className="my-4" />

      {/* Question */}
      <p className="font-medium text-gray-700 mb-4">Apakah anda yakin?</p>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition"
        >
          Tolak Aset
        </button>
      </div>
    </div>
  );
};

export default KonfirmasiPenolakan;
