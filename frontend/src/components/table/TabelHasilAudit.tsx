import { useEffect, useState } from "react";
import { Eye, Download, Folder, MessageCircleMore } from "lucide-react";

import ModalLihatAudit from "../form/Admin/LihatAudit";
import AuditorModal from "../../components/auditor/AuditorModal"; // ⬅️ Tambahkan ini

interface AuditFile {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
}

interface Props {
  search: string;
  dinas: string;
  periode: { start: string; end: string } | null;
}

export default function TabelHasilAudit({ search, dinas, periode }: Props) {
  const [data, setData] = useState<AuditFile[]>([]);
  const [filtered, setFiltered] = useState<AuditFile[]>([]);

  // === MODAL LIHAT ===
  const [lihatOpen, setLihatOpen] = useState(false);
  const [selected, setSelected] = useState<AuditFile | null>(null);

  const openLihat = (item: AuditFile) => {
    setSelected(item);
    setLihatOpen(true);
  };

  // === MODAL KOMENTAR ===
  const [komentarOpen, setKomentarOpen] = useState(false);

  const openKomentar = () => {
    setKomentarOpen(true);
  };

  const handleSubmitKomentar = (comment: string) => {
    console.log("Komentar terkirim:", comment);
    setKomentarOpen(false);
  };

  // === DOWNLOAD ===
  const handleDownload = (item: AuditFile) => {
    const blob = new Blob([`Dummy file untuk ${item.name}`], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${item.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // === DUMMY DATA ===
  useEffect(() => {
    const dummy: AuditFile[] = [
      {
        id: "1",
        file_code: "235436",
        name: "Laporan SDM 2021",
        dinas: "Dinas Pariwisata",
        date: "10/24/2025 - 10:45",
      },
      {
        id: "2",
        file_code: "723632",
        name: "Laporan SDM 2021",
        dinas: "Dinas Pariwisata",
        date: "10/24/2025 - 10:45",
      },
      {
        id: "3",
        file_code: "365532",
        name: "Laporan SDM 2021",
        dinas: "Dinas Komunikasi",
        date: "10/24/2025 - 10:45",
      },
      {
        id: "4",
        file_code: "376351",
        name: "Laporan Mencintaimu",
        dinas: "Dinas Komunikasi",
        date: "10/24/2025 - 10:45",
      },
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
      temp = temp.filter(
        (x) => x.dinas.toLowerCase() === dinas.toLowerCase()
      );
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
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
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Folder className="w-4 h-4 text-gray-700" />
                      <span className="text-sm">{item.file_code}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-sm">{item.name}</td>
                  <td className="py-4 px-6 text-sm">{item.dinas}</td>
                  <td className="py-4 px-6 text-sm">{item.date}</td>

                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-6">
                      <Eye
                        onClick={() => openLihat(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />

                      <MessageCircleMore
                        onClick={openKomentar}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />

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

      {/* ==== MODAL LIHAT ==== */}
      <ModalLihatAudit
        isOpen={lihatOpen}
        onClose={() => setLihatOpen(false)}
        data={selected}
      />

      {/* ==== MODAL KOMENTAR ==== */}
      <AuditorModal
        isOpen={komentarOpen}
        onClose={() => setKomentarOpen(false)}
        onSubmit={handleSubmitKomentar}
      />
    </>
  );
}
