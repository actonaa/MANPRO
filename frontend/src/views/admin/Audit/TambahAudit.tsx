import { X, Upload } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TambahAudit({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Tambah Hasil Audit
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <hr className="mb-4" />

        {/* NAMA DOKUMEN */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Nama Dokumen
          </label>
          <input
            type="text"
            placeholder="Masukkan masa pakai"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* DINAS */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Dinas</label>
          <div className="relative">
            <input
              placeholder="Masukkan Dinas"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
            <span className="absolute right-3 top-3 text-gray-500">⌄</span>
          </div>
        </div>

        {/* UPLOAD */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Unggah Dokumen
          </label>

          <div className="mt-2 border border-gray-300 rounded-lg p-6 text-center">
            <button className="flex items-center gap-2 mx-auto text-gray-700 border border-gray-300 rounded-lg px-4 py-2">
              <Upload className="w-4 h-4" />
              Unggah Dokumen
            </button>
            <p className="mt-2 text-xs text-gray-500">
              File dengan ukuran kurang dari 1 MB
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-center">
          <button
            className="bg-[#1A73E8] text-white px-10 py-2 rounded-lg hover:bg-[#1669C1] transition"
            onClick={onClose}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
