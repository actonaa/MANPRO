import { useEffect, useState } from "react";
import { Eye, Download, Folder, MessageCircleMore, X } from "lucide-react";

import AuditFile from "../../components/auditor/AuditorFile"; // Modal komentar

interface AuditFileType {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
  file_url?: string;
  file_name?: string;
}

interface Props {
  search: string;
  dinas: string;
  periode: { start: string; end: string } | null;
}

export default function TabelHasilAudit({ search, dinas, periode }: Props) {
  const [data, setData] = useState<AuditFileType[]>([]);
  const [filtered, setFiltered] = useState<AuditFileType[]>([]);

  // === MODAL KOMENTAR ===
  const [komentarOpen, setKomentarOpen] = useState(false);
  const [selectedKomentar, setSelectedKomentar] = useState<AuditFileType | null>(null);

  const openKomentar = (item: AuditFileType) => {
    setSelectedKomentar(item);
    setKomentarOpen(true);
  };

  const handleSubmitKomentar = (comment: string) => {
    console.log("Komentar terkirim untuk", selectedKomentar?.name, ":", comment);
    setKomentarOpen(false);
  };

  // === DOWNLOAD ===
  const handleDownload = (item: AuditFileType) => {
    const blob = new Blob([`Dummy file untuk ${item.name}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // === VIEWER POPUP ===
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<AuditFileType | null>(null);

  const openViewer = (item: AuditFileType) => {
    if (item.file_url) {
      setSelectedFile(item);
      setViewerOpen(true);
    } else {
      alert("File tidak tersedia");
    }
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedFile(null);
  };

  // === DUMMY DATA ===
  useEffect(() => {
    const dummy: AuditFileType[] = [
      { id: "1", file_code: "235436", name: "Laporan SDM 2021", dinas: "Dinas Pariwisata", date: "10/24/2025 - 10:45", file_url: "https://example.com/file1.pdf", file_name: "file1.pdf" },
      { id: "2", file_code: "723632", name: "Laporan SDM 2021", dinas: "Dinas Pariwisata", date: "10/24/2025 - 10:45", file_url: "https://example.com/file2.pdf", file_name: "file2.pdf" },
      { id: "3", file_code: "365532", name: "Laporan SDM 2021", dinas: "Dinas Komunikasi", date: "10/24/2025 - 10:45" },
      { id: "4", file_code: "376351", name: "Laporan Mencintaimu", dinas: "Dinas Komunikasi", date: "10/24/2025 - 10:45", file_url: "https://example.com/file4.pdf", file_name: "file4.pdf" },
    ];
    setData(dummy);
    setFiltered(dummy);
  }, []);

  // === FILTER ===
  useEffect(() => {
    let temp = [...data];

    if (search) {
      const s = search.toLowerCase();
      temp = temp.filter(
        (x) =>
          x.file_code.toLowerCase().includes(s) ||
          x.name.toLowerCase().includes(s) ||
          x.dinas.toLowerCase().includes(s)
      );
    }

    if (dinas.trim() !== "") {
      temp = temp.filter((x) => x.dinas.toLowerCase() === dinas.toLowerCase());
    }

    if (periode?.start && periode?.end) {
      const start = new Date(periode.start);
      const end = new Date(periode.end);

      temp = temp.filter((x) => {
        const fileDate = new Date(x.date.split(" - ")[0]);
        return fileDate >= start && fileDate <= end;
      });
    }

    setFiltered(temp);
  }, [search, dinas, periode, data]);

  return (
    <>
      {/* ==== TABLE ==== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead className="bg-white border-b border-gray-200 text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-4 px-6 font-medium">File Dokumen</th>
                <th className="py-4 px-6 font-medium">Nama Dokumen</th>
                <th className="py-4 px-6 font-medium">Dinas</th>
                <th className="py-4 px-6 font-medium">Tanggal & Waktu</th>
                <th className="py-4 px-6 font-medium text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <Folder className="w-4 h-4 text-gray-700" />
                    <span className="text-sm">{item.file_code}</span>
                  </td>
                  <td className="py-4 px-6 text-sm">{item.name}</td>
                  <td className="py-4 px-6 text-sm">{item.dinas}</td>
                  <td className="py-4 px-6 text-sm">{item.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-6">
                      {/* === Lihat File popup === */}
                      <Eye
                        onClick={() => openViewer(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />

                      {/* === Komentar === */}
                      <MessageCircleMore
                        onClick={() => openKomentar(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />

                      {/* === Download === */}
                      <Download
                        onClick={() => handleDownload(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== MODAL VIEWER ==== */}
      {viewerOpen && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl p-4 relative shadow-lg">
            {/* Close button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-lg font-semibold mb-2">{selectedFile.name}</h2>

            {selectedFile.file_url ? (
              <iframe
                src={selectedFile.file_url}
                className="w-full h-[600px]"
                title={selectedFile.name}
              />
            ) : (
              <p className="text-gray-500 italic">File tidak tersedia</p>
            )}
          </div>
        </div>
      )}

      {/* ==== MODAL KOMENTAR ==== */}
      <AuditFile
        isOpen={komentarOpen}
        onClose={() => setKomentarOpen(false)}
        onSubmit={handleSubmitKomentar}
        data={selectedKomentar}
      />
    </>
  );
}
