import React from "react";
import { X } from "lucide-react";

interface HapusAsetTahap2Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetName: string;
}

const HapusAsetTahap2: React.FC<HapusAsetTahap2Props> = ({
  open,
  onClose,
  onConfirm,
  assetName,
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(); // jalankan fungsi konfirmasi ke parent
    setTimeout(() => {
      window.location.reload(); // refresh otomatis
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 transition-opacity duration-200">
      <div className="bg-white w-[360px] rounded-xl shadow-md p-5 pb-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Hapus {assetName}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="text-center text-gray-700 mb-5">
          Apakah anda yakin ingin menghapus aset <br />
          <span className="font-semibold">“{assetName}”</span> ?
        </p>

        <button
          onClick={handleConfirm}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium mb-2"
        >
          Ya
        </button>

        <button
          onClick={onClose}
          className="w-full border py-2 rounded-lg font-medium"
        >
          Tidak
        </button>
      </div>
    </div>
  );
};

export default HapusAsetTahap2;
