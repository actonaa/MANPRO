import { X, FileText } from "lucide-react";

interface AuditFile {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
  file_url?: string; // ← Tambahkan URL file
  file_name?: string; // ← Tambahkan nama file
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: AuditFile | null;
}

export default function ModalLihatAudit({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Lihat Hasil Audit
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-4" />

        {/* DETAIL */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Kode File</span>
            <span>{data.file_code}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Nama Dokumen</span>
            <span>{data.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Dinas</span>
            <span>{data.dinas}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Tanggal</span>
            <span>{data.date}</span>
          </div>

          {/* FILE DOKUMEN */}
          <div className="flex justify-between items-center">
            <span className="font-medium">File Dokumen</span>

            {data.file_name ? (
              <a
                href={data.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FileText className="w-4 h-4" />
                {data.file_name}
              </a>
            ) : (
              <span className="text-gray-500 italic">Tidak ada file</span>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#1A73E8] text-white px-10 py-2 rounded-lg hover:bg-[#1669C1]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}