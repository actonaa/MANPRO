import { XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

type AsetItem = {
  id: string;
  name: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  tanggal: string;
};

interface HapusAsetConfirmProps {
  aset: AsetItem;
  onClose: () => void;
  onConfirm: (aset: AsetItem) => Promise<void>; // <- pastikan async
}

export default function HapusAsetConfirm({
  aset,
  onClose,
  onConfirm,
}: HapusAsetConfirmProps) {
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoadingConfirm(true);
      await onConfirm(aset);
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-xl relative">
        {/* Icon merah */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 flex items-center justify-center rounded-full">
            <XCircle className="text-red-500" size={45} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          Konfirmasi Penghapusan
        </h2>

        <p className="text-gray-500 mt-2">
          Aset akan dihapus dan berubah status menjadi Decommisioned
        </p>

        <p className="text-gray-800 font-medium mt-4">Apakah anda yakin?</p>

        {/* Tombol */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={loadingConfirm}
            className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={handleConfirm}
            disabled={loadingConfirm}
            className="px-6 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loadingConfirm ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Memproses...
              </>
            ) : (
              "Ya, hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
