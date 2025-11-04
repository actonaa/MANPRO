import React from "react";
import { CircleHelp } from "lucide-react";

interface AsetItem {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  status: string;
  tanggal: string;
}

interface KonfirmasiPenolakanProps {
  aset: AsetItem;
  onClose: () => void;
}

const KonfirmasiPenolakan: React.FC<KonfirmasiPenolakanProps> = ({
  aset,
  onClose,
}) => {
  const handleConfirm = () => {
    console.log("❌ Aset ditolak:", aset);
    // TODO: tambahkan logika API kirim alasan penolakan di sini
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md text-center animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 p-3 rounded-full">
            <CircleHelp className="text-red-500 w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Konfirmasi Penolakan
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Aset akan dikirim kembali kepada pengguna dinas untuk diperbaiki.
        </p>

        {/* Divider */}
        <hr className="my-4 border-gray-300" />

        {/* Question */}
        <p className="font-medium text-gray-700 mb-4">
          Apakah Anda yakin ingin menolak aset ini?
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition w-full sm:w-auto"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition w-full sm:w-auto"
          >
            Tolak Aset
          </button>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiPenolakan;
