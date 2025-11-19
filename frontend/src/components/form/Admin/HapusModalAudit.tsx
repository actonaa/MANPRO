import { X, Trash2 } from "lucide-react";

interface AuditFile {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: AuditFile | null;
}

export default function ModalHapusAudit({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Hapus Hasil Audit
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-4" />

        <p className="text-gray-700 text-sm mb-6">
          Apakah Anda yakin ingin menghapus dokumen
          <span className="font-semibold"> {data.name}</span>?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={() => {
              console.log("HAPUS:", data.id);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}