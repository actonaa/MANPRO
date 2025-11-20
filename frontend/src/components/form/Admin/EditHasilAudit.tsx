import { X, Upload } from "lucide-react";

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

export default function ModalEditAudit({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Hasil Audit
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-4" />

        {/* Nama Dokumen */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Nama Dokumen
          </label>
          <input
            defaultValue={data.name}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        {/* Dinas */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Dinas</label>
          <input
            defaultValue={data.dinas}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        {/* Upload */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Unggah Dokumen
          </label>

          <div className="mt-2 border border-gray-300 rounded-lg p-6 text-center">
            <button className="flex items-center gap-2 mx-auto text-gray-700 border border-gray-300 rounded-lg px-4 py-2">
              <Upload className="w-4 h-4" />
              Unggah Dokumen
            </button>
            <p className="mt-2 text-xs text-gray-500">Ukuran maksimal 1 MB</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-[#1A73E8] text-white px-10 py-2 rounded-lg hover:bg-[#1669C1]"
            onClick={onClose}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}