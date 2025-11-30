/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModalHapusRisikoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  judul: string; // Judul Risiko
}

export default function ModalHapusRisiko({
  open,
  onClose,
  onConfirm,
  judul,
}: ModalHapusRisikoProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[92%] max-w-md text-center shadow-lg">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-2xl">?</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Konfirmasi Penghapusan
        </h2>

        {/* Description */}
        <p className="mt-2 text-gray-600">
          Risiko <span className="font-semibold">"{judul}"</span> akan dihapus.
        </p>

        {/* Question */}
        <p className="mt-4 text-gray-700 font-medium">Apakah anda yakin?</p>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            className="px-5 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="px-5 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition"
            onClick={onConfirm}
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}
