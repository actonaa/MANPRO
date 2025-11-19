import { useEffect, useState } from "react";
import { Eye, Download, Trash2, Folder, Pencil } from "lucide-react";
import ModalHapusAudit from "../form/Admin/HapusModalAudit";
import ModalEditAudit from "../form/Admin/EditHasilAudit";
import ModalLihatAudit from "../form/Admin/LihatAudit";

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

  // === MODALS ===
  const [lihatOpen, setLihatOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [hapusOpen, setHapusOpen] = useState(false);

  const [selected, setSelected] = useState<AuditFile | null>(null);

  const openLihat = (item: AuditFile) => {
    setSelected(item);
    setLihatOpen(true);
  };

  const openEdit = (item: AuditFile) => {
    setSelected(item);
    setEditOpen(true);
  };

  const openHapus = (item: AuditFile) => {
    setSelected(item);
    setHapusOpen(true);
  };

  // === PERBAIKAN FUNCTION DOWNLOAD ===
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

  // === FILTERING ===
  useEffect(() => {
    let temp = [...data];

    if (search) {
      temp = temp.filter(
        (x) =>
          x.file_code.toLowerCase().includes(search.toLowerCase()) ||
          x.name.toLowerCase().includes(search.toLowerCase()) ||
          x.dinas.toLowerCase().includes(search.toLowerCase())
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* ==== MOBILE VIEW ==== */}
        <div className="lg:hidden p-4 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-xl bg-white"
            >
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-gray-700" />
                <p className="font-medium">{item.file_code}</p>
              </div>

              <h2 className="mt-2 font-semibold text-gray-900">{item.name}</h2>

              <div className="mt-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Dinas</span>
                  <span>{item.dinas}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Tanggal</span>
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="flex gap-5 mt-4 justify-end">
                <Eye
                  onClick={() => openLihat(item)}
                  className="w-5 h-5 text-gray-700 cursor-pointer"
                />
                <Pencil
                  onClick={() => openEdit(item)}
                  className="w-5 h-5 text-gray-700 cursor-pointer"
                />
                <Download
                  onClick={() => handleDownload(item)}
                  className="w-5 h-5 text-gray-700 cursor-pointer"
                />
                <Trash2
                  onClick={() => openHapus(item)}
                  className="w-5 h-5 text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ==== DESKTOP VIEW ==== */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-center border-collapse">
            <thead className="bg-white border-b border-gray-200 text-gray-600 text-sm">
              <tr>
                <th className="py-5 px-6">FILE DOKUMEN</th>
                <th className="py-5 px-6">NAMA DOKUMEN</th>
                <th className="py-5 px-6">DINAS</th>
                <th className="py-5 px-6">TANGGAL & WAKTU</th>
                <th className="py-5 px-6">AKSI</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-5 px-6">
                    <div className="flex justify-center gap-3">
                      <Folder className="w-5 h-5 text-gray-700" />
                      <span>{item.file_code}</span>
                    </div>
                  </td>

                  <td className="py-5 px-6">{item.name}</td>
                  <td className="py-5 px-6">{item.dinas}</td>
                  <td className="py-5 px-6">{item.date}</td>

                  <td className="py-5 px-6">
                    <div className="flex justify-center gap-5">
                      <Eye
                        onClick={() => openLihat(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />
                      <Pencil
                        onClick={() => openEdit(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />
                      <Download
                        onClick={() => handleDownload(item)}
                        className="w-5 h-5 text-gray-700 cursor-pointer"
                      />
                      <Trash2
                        onClick={() => openHapus(item)}
                        className="w-5 h-5 text-red-500 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== MODAL RENDER ==== */}
      <ModalLihatAudit
        isOpen={lihatOpen}
        onClose={() => setLihatOpen(false)}
        data={selected}
      />
      <ModalEditAudit
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        data={selected}
      />
      <ModalHapusAudit
        isOpen={hapusOpen}
        onClose={() => setHapusOpen(false)}
        data={selected}
      />
    </>
  );
}
