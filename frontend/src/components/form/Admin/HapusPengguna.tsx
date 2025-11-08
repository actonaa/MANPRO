import { AlertTriangle, Trash2 } from "lucide-react";

interface PopupHapusPenggunaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nama: string;
  email: string;
}

export default function PopupHapusPengguna({
  isOpen,
  onClose,
  onConfirm,
  nama,
  email,
}: PopupHapusPenggunaProps) {
  if (!isOpen) return null;
  console.log("✅ Popup aktif:", nama);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[10000]">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon Warning */}
          <div className="flex justify-center mb-5">
            <div className="bg-red-50 p-4 rounded-full">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-900">
            Hapus Pengguna
          </h2>
          <p className="text-center text-gray-500 mt-2 mb-6">
            Apakah anda yakin ingin menghapus akun pengguna ini?
            <br />
            <span className="text-gray-500">
              Aksi ini tidak dapat dibatalkan.
            </span>
          </p>

          <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 text-center mb-6">
            <p className="font-semibold text-gray-900">{nama}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          <div className="border-t border-gray-200 mb-6"></div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="w-full py-2.5 rounded-lg bg-red-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Pengguna
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
