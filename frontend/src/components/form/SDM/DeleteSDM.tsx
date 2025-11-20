import { X } from "lucide-react";
import { useState } from "react"; // <-- DITAMBAHKAN

interface DeleteSDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (reason: string) => void;
}

export default function DeleteSDMModal({
  isOpen,
  onClose,
  onDelete,
}: DeleteSDMModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeIn">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Hapus Data SDM
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          Apakah Anda yakin ingin menghapus data SDM ini? Mohon tuliskan alasan
          penghapusan sebagai catatan sistem.
        </p>

        {/* Textarea alasan */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan penghapusan..."
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none min-h-[90px]"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            onClick={() => {
              onDelete(reason);
              setReason("");
            }}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
