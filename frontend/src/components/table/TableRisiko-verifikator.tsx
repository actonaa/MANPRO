import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import RisikoSetuju from "../../components/form/verifikator/RisikoSetuju";
import RisikoTolak from "../../components/form/verifikator/RisikoTolak";

type TableRisikoProps = {
  selectedLevel?: string;
  selectedDate?: { start: string; end: string } | null;
};

type RisikoItem = {
  id: string;
  date: string;
  title: string;
  criteria: string;
  category: string;
  entry_level: number;
  asset: { name: string; lokasi: string };
  department: { name: string };
};

export default function TableRisiko({
  selectedLevel = "",
  selectedDate = null,
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [selectedRisiko, setSelectedRisiko] = useState<RisikoItem | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // 📊 Dummy data
  useEffect(() => {
    setData([
      {
        id: "RISK-001",
        date: "2025-10-10",
        title: "Gangguan Jaringan",
        criteria: "Tinggi",
        category: "IT",
        entry_level: 25,
        asset: { name: "Server Utama", lokasi: "Data Center" },
        department: { name: "IT" },
      },
      {
        id: "RISK-002",
        date: "2025-10-20",
        title: "Kehilangan Data",
        criteria: "Sedang",
        category: "IT",
        entry_level: 18,
        asset: { name: "Database", lokasi: "Server Room" },
        department: { name: "IT" },
      },
      {
        id: "RISK-003",
        date: "2025-09-25",
        title: "Kerusakan Perangkat",
        criteria: "Rendah",
        category: "NON-IT",
        entry_level: 10,
        asset: { name: "CCTV Lobby", lokasi: "Lobi Utama" },
        department: { name: "Maintenance" },
      },
    ]);
  }, []);

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesLevel = selectedLevel
      ? item.criteria.toLowerCase() === selectedLevel.toLowerCase()
      : true;

    const matchesDate = selectedDate
      ? item.date >= selectedDate.start && item.date <= selectedDate.end
      : true;

    return matchesLevel && matchesDate;
  });

  // 🟢 Handler untuk setuju
  const handleApproveClick = (item: RisikoItem) => {
    setSelectedRisiko(item);
    setShowApproveModal(true);
  };

  // 🔴 Handler untuk tolak
  const handleRejectClick = (item: RisikoItem) => {
    setSelectedRisiko(item);
    setShowRejectModal(true);
  };

  // ✅ Konfirmasi persetujuan
  const confirmApprove = () => {
    console.log("✅ Risiko disetujui:", selectedRisiko);
    setShowApproveModal(false);
    setSelectedRisiko(null);
  };

  // ❌ Konfirmasi penolakan
  const confirmReject = () => {
    console.log("❌ Risiko ditolak:", selectedRisiko);
    setShowRejectModal(false);
    setSelectedRisiko(null);
  };

  return (
    <div className="md:pb-10 lg:bg-white lg:shadow-xl lg:p-5 lg:rounded-2xl relative">
      {/* 🖥️ Tabel Desktop */}
      <div className="hidden lg:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">{item.date}</td>
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.asset.name}</td>
                <td className="py-5 px-4">{item.title}</td>
                <td
                  className={`py-5 px-4 font-semibold ${
                    item.criteria === "Tinggi"
                      ? "text-red-500"
                      : item.criteria === "Sedang"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {item.criteria}
                </td>
                <td className="py-5 px-4">{item.category}</td>
                <td className="py-5 px-4">{item.entry_level}</td>
                <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                  <a
                    href="/risiko-verifikator/detail"
                    className="hover:text-blue-600"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </a>
                  <button
                    onClick={() => handleApproveClick(item)}
                    className="hover:text-green-600"
                    title="Setujui Risiko"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleRejectClick(item)}
                    className="hover:text-red-600"
                    title="Tolak Risiko"
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Card Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>

            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.asset.name}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Level:</span>{" "}
                <span
                  className={`${
                    item.criteria === "Tinggi"
                      ? "text-red-500"
                      : item.criteria === "Sedang"
                      ? "text-orange-500"
                      : "text-green-500"
                  } font-semibold`}
                >
                  {item.criteria}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Kategori:</span>{" "}
                {item.category}
              </p>
              <p>
                <span className="font-medium text-gray-700">Skor:</span>{" "}
                {item.entry_level}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4 text-gray-500">
              <a
                href="/risiko-verifikator/detail"
                className="hover:text-blue-600"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </a>
              <button
                onClick={() => handleApproveClick(item)}
                className="hover:text-green-600"
                title="Setujui Risiko"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleRejectClick(item)}
                className="hover:text-red-600"
                title="Tolak Risiko"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}

      {/* 🟢 Popup Persetujuan */}
      {showApproveModal && selectedRisiko && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <RisikoSetuju
            namaRisiko={selectedRisiko.title}
            asetTerkait={selectedRisiko.asset.name}
            onCancel={() => setShowApproveModal(false)}
            onConfirm={confirmApprove}
          />
        </div>
      )}

      {/* 🔴 Popup Penolakan */}
      {showRejectModal && selectedRisiko && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <RisikoTolak
            namaRisiko={selectedRisiko.title}
            asetTerkait={selectedRisiko.asset.name}
            onCancel={() => setShowRejectModal(false)}
            onConfirm={confirmReject}
          />
        </div>
      )}
    </div>
  );
}
