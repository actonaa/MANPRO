import { useState } from "react";
import { Download, ClipboardCopy, X } from "lucide-react";
import ExportModal from "./Export";

interface DetailData {
  datetime: string;
  user: string;
  dinas: string;
  role: string;
  module: string;
  action: string;
  description?: string;
  ip?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: DetailData | null;
}

export default function ModalDetailAktivitas({ isOpen, onClose, data }: Props) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  if (!isOpen || !data) return null;

  const getActionColor = (action: string) => {
    if (action === "CREATE") return "text-green-600 font-semibold";
    if (action === "UPDATE") return "text-blue-600 font-semibold";
    if (action === "DELETE") return "text-red-600 font-semibold";
    return "text-gray-700";
  };

  // ✅ Fungsi salin format teks rapi
  const handleCopyDetails = () => {
    const textToCopy = `
Detail Aktivitas:
TANGGAL & WAKTU: ${data.datetime}
NAMA PENGGUNA: ${data.user}
NAMA DINAS: ${data.dinas}
PERAN: ${data.role}
MODUL: ${data.module}
AKSI: ${data.action}
Deskripsi: ${data.description || "-"}
IP Address: ${data.ip || "-"}
    `.trim();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Detail berhasil disalin ke clipboard!");
      })
      .catch(() => {
        alert("Gagal menyalin detail.");
      });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-lg flex flex-col max-h-[90vh] border border-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200/70 p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Detail Aktivitas
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 text-sm">
            <div className="grid grid-cols-2 gap-y-4">
              <span className="text-gray-500 font-medium">TANGGAL & WAKTU</span>
              <span className="text-gray-700">{data.datetime}</span>

              <span className="text-gray-500 font-medium">NAMA PENGGUNA</span>
              <span className="text-gray-700">{data.user}</span>

              <span className="text-gray-500 font-medium">NAMA DINAS</span>
              <span className="text-gray-700">{data.dinas}</span>

              <span className="text-gray-500 font-medium">PERAN</span>
              <span className="text-gray-700">{data.role}</span>

              <span className="text-gray-500 font-medium">MODUL</span>
              <span className={getActionColor(data.action)}>{data.module}</span>

              <span className="text-gray-500 font-medium">AKSI</span>
              <span className="text-gray-700">{data.action}</span>

              <span className="text-gray-500 font-medium">Deskripsi</span>
              <span className="text-gray-700 leading-relaxed whitespace-pre-line">
                {data.description || "-"}
              </span>

              <span className="text-gray-500 font-medium">IP Address</span>
              <span className="text-gray-700">{data.ip || "-"}</span>
            </div>
          </div>

          {/* Footer (sticky) */}
          <div className="flex justify-between border-t border-gray-200/70 p-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 text-sm border border-gray-200/70 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Export
            </button>

            <button
              onClick={handleCopyDetails}
              className="flex items-center gap-2 text-sm border border-gray-200/70 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              <ClipboardCopy className="w-4 h-4 text-gray-500" />
              Salin Detail
            </button>
          </div>
        </div>
      </div>

      {/* Modal Export */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={() => setIsExportOpen(false)}
      />
    </>
  );
}
