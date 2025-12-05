import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import AuditorModal from "../auditor/AuditorModal"; // ⬅ pastikan path benar

type PemeliharaanItem = {
  id: string;
  dinas: string;
  aset_id: string;
  jenis: string;
  biaya: string;
  mitigasi: string;
  jadwal: string;
  realisasi: string;
  prioritas: "Tinggi" | "Sedang" | "Rendah";
};

type Props = {
  filters: {
    search: string;
    date: { start: string; end: string };
  };
};

const dummyData: PemeliharaanItem[] = [
  {
    id: "1",
    dinas: "DISKOMINFO",
    aset_id: "AST - 001",
    jenis: "Insidental",
    biaya: "Rp21.500.000",
    mitigasi: "Pendinginan darurat; pemasangan",
    jadwal: "02-12-2024",
    realisasi: "02-12-2024",
    prioritas: "Tinggi",
  },
  {
    id: "2",
    dinas: "DISKOMINFO",
    aset_id: "AST - 002",
    jenis: "Terjadwal",
    biaya: "Rp1.500.000",
    mitigasi: "Pelumasan berkala",
    jadwal: "02-12-2024",
    realisasi: "02-12-2024",
    prioritas: "Sedang",
  },
  {
    id: "3",
    dinas: "DISKOMINFO",
    aset_id: "AST - 003",
    jenis: "Terjadwal",
    biaya: "Rp150.000",
    mitigasi: "Kalibrasi alat ukur; validasi",
    jadwal: "02-12-2024",
    realisasi: "02-12-2024",
    prioritas: "Rendah",
  },
  {
    id: "4",
    dinas: "DISKOMINFO",
    aset_id: "AST - 004",
    jenis: "Insidental",
    biaya: "Rp21.500.000",
    mitigasi: "Penggantian komponen kritis;",
    jadwal: "02-12-2024",
    realisasi: "02-12-2024",
    prioritas: "Tinggi",
  },
];

export default function TablePemeliharaanAuditor({ filters }: Props) {
  const [selectedRow, setSelectedRow] = useState<PemeliharaanItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = dummyData.filter((item) =>
    item.aset_id.toLowerCase().includes(filters.search.toLowerCase())
  );

  const priorityColor = (level: string) => {
    if (level === "Tinggi") return "text-red-500 font-semibold";
    if (level === "Sedang") return "text-yellow-600 font-semibold";
    return "text-blue-600 font-semibold";
  };

  return (
    <>
      {/* ===== TABLE ===== */}
      <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-600 border-b border-b-gray-300">
            <tr>
              <th className="p-3 text-left">DINAS</th>
              <th className="p-3 text-left">ID ASET</th>
              <th className="p-3 text-left">JENIS</th>
              <th className="p-3 text-left">BIAYA</th>
              <th className="p-3 text-left">MITIGASI</th>
              <th className="p-3 text-left">JADWAL PEMELIHARAAN</th>
              <th className="p-3 text-left">REALISASI</th>
              <th className="p-3 text-left">PRIORITAS RISIKO</th>
              <th className="p-3 text-left">DETAIL</th>
              <th className="p-3 text-center"></th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-gray-300 last:border-0"
              >
                <td className="p-3">{item.dinas}</td>
                <td className="p-3">{item.aset_id}</td>
                <td className="p-3">{item.jenis}</td>
                <td className="p-3">{item.biaya}</td>

                <td className="p-3 max-w-[220px] whitespace-pre-wrap leading-snug">
                  {item.mitigasi}
                </td>

                <td className="p-3">{item.jadwal}</td>
                <td className="p-3">{item.realisasi}</td>

                <td className={`p-3 ${priorityColor(item.prioritas)}`}>
                  {item.prioritas}
                </td>

                <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                  Detail
                </td>

                {/* === BUTTON OPEN MODAL === */}
                <td className="p-3 text-center">
                  <MessageCircleMore
                    className="w-5 h-5 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setSelectedRow(item);
                      setModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Menampilkan {filtered.length} dari {dummyData.length} hasil
          </span>

          <div className="flex items-center gap-3">
            <button className="px-2 hover:text-black">&lt;</button>
            <button className="px-3 py-1 border rounded-lg bg-gray-100 font-medium">
              1
            </button>
            <button className="px-3 py-1">2</button>
            <button className="px-3 py-1">3</button>
            <button className="px-3 py-1">4</button>
            <button className="px-3 py-1">5</button>
            <button className="px-2 hover:text-black">&gt;</button>
          </div>
        </div>
      </div>

      {/* ===== AUDITOR MODAL ===== */}
      <AuditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(comment) => {
          console.log("Komentar Auditor:", comment);
          setModalOpen(false);
        }}
        data={
          selectedRow
            ? {
                id: selectedRow.id,
                title: `Pemeliharaan ${selectedRow.aset_id}`,
                asset_info: { name: selectedRow.aset_id },
              }
            : null
        }
      />
    </>
  );
}
