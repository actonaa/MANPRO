import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SetujuPemeliharaan from "../../components/form/verifikator/setujuPemeliharaan";
import TolakPemeliharaan from "../../components/form/verifikator/tolakPemeliharaan";

type TablePemeliharaanProps = {
  selectedLevel?: string;
  selectedStatus?: string;
  selectedDate?: { start: string; end: string } | null;
};

type PemeliharaanItem = {
  idAset: string;
  idLaporan: string;
  jenis: string;
  biaya: string;
  vendor: string;
  realisasi: string;
  status: string;
};

// 🔹 Fungsi format tanggal
const formatTanggal = (tanggal: string) => {
  const date = new Date(tanggal);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} - ${month} - ${year}`;
};

export default function TablePemeliharaanVerifikator({
  selectedLevel = "",
  selectedStatus = "",
  selectedDate = null,
}: TablePemeliharaanProps) {
  const [data, setData] = useState<PemeliharaanItem[]>([]);
  const [openSetuju, setOpenSetuju] = useState(false);
  const [openTolak, setOpenTolak] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PemeliharaanItem | null>(
    null
  );

  useEffect(() => {
    setData([
      {
        idAset: "AST-001",
        idLaporan: "LAP-090",
        jenis: "Perawatan Hardware",
        biaya: "Rp 2.500.000",
        vendor: "TechnoFix",
        realisasi: "2025-01-12",
        status: "Selesai",
      },
      {
        idAset: "AST-002",
        idLaporan: "LAP-091",
        jenis: "Penggantian Komponen",
        biaya: "Rp 1.750.000",
        vendor: "PT DigitalCare",
        realisasi: "2025-01-14",
        status: "Proses",
      },
      {
        idAset: "AST-003",
        idLaporan: "LAP-092",
        jenis: "Update Software",
        biaya: "Rp 500.000",
        vendor: "NetTech",
        realisasi: "2025-01-15",
        status: "Menunggu",
      },
      {
        idAset: "AST-004",
        idLaporan: "LAP-093",
        jenis: "Kalibrasi Sistem",
        biaya: "Rp 3.000.000",
        vendor: "SmartSolution",
        realisasi: "2025-01-17",
        status: "Selesai",
      },
    ]);
  }, []);

  // ✅ Fungsi tombol aksi
  const handleSetuju = (item: PemeliharaanItem) => {
    setSelectedItem(item);
    setOpenSetuju(true);
  };

  const handleTolak = (item: PemeliharaanItem) => {
    setSelectedItem(item);
    setOpenTolak(true);
  };

  // 🔍 Filter data
  const filteredData = data.filter((item) => {
    const matchLevel = selectedLevel
      ? item.jenis.toLowerCase().includes(selectedLevel.toLowerCase())
      : true;
    const matchStatus = selectedStatus
      ? item.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;
    const matchDate = selectedDate
      ? item.realisasi >= selectedDate.start &&
        item.realisasi <= selectedDate.end
      : true;
    return matchLevel && matchStatus && matchDate;
  });

  return (
    <div className="md:pb-10 xl:bg-white xl:shadow-xl xl:p-5 xl:rounded-2xl">
      {/* 🖥️ Tabel Desktop */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full min-w-[950px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666] bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID ASET</th>
              <th className="px-6 py-3">ID LAPORAN</th>
              <th className="px-6 py-3">JENIS</th>
              <th className="px-6 py-3">BIAYA</th>
              <th className="px-6 py-3">VENDOR</th>
              <th className="px-6 py-3">REALISASI</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.idLaporan}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-4 px-6">{item.idAset}</td>
                <td className="py-4 px-6">{item.idLaporan}</td>
                <td className="py-4 px-6">{item.jenis}</td>
                <td className="py-4 px-6">{item.biaya}</td>
                <td className="py-4 px-6">{item.vendor}</td>
                <td className="py-4 px-6 text-gray-600">
                  {formatTanggal(item.realisasi)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-3 text-gray-500">
                    <Link
                      to={`/pemeliharaan-verifikator/detail`}
                      className="hover:text-blue-600"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => handleSetuju(item)}
                      className="hover:text-green-600"
                      title="Setujui Pemeliharaan"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleTolak(item)}
                      className="hover:text-red-600"
                      title="Tolak Pemeliharaan"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Tampilan Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {filteredData.map((item) => (
          <div
            key={item.idLaporan}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.jenis}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.vendor}</p>

            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID Aset:</span>{" "}
                {item.idAset}
              </p>
              <p>
                <span className="font-medium text-gray-700">ID Laporan:</span>{" "}
                {item.idLaporan}
              </p>
              <p>
                <span className="font-medium text-gray-700">Biaya:</span>{" "}
                {item.biaya}
              </p>
              <p>
                <span className="font-medium text-gray-700">Realisasi:</span>{" "}
                {formatTanggal(item.realisasi)}
              </p>
            </div>

            {/* 🔹 Tombol Aksi (Mobile) */}
            <div className="flex justify-end gap-3 mt-4 text-gray-500">
              <Link
                to={`/pemeliharaan-verifikator/detail`}
                className="hover:text-blue-600"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </Link>
              <button
                onClick={() => handleSetuju(item)}
                className="hover:text-green-600"
                title="Setujui Pemeliharaan"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleTolak(item)}
                className="hover:text-red-600"
                title="Tolak Pemeliharaan"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {openSetuju && selectedItem && (
        <SetujuPemeliharaan
          open={openSetuju}
          onClose={() => setOpenSetuju(false)}
          onConfirm={() => console.log("Setuju:", selectedItem)}
          namaRisiko={selectedItem.jenis}
          asetTerkait={selectedItem.idAset}
        />
      )}

      {openTolak && selectedItem && (
        <TolakPemeliharaan
          open={openTolak}
          onClose={() => setOpenTolak(false)}
          onConfirm={() => console.log("Tolak:", selectedItem)}
          namaRisiko={selectedItem.jenis}
          asetTerkait={selectedItem.idAset}
        />
      )}

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok dengan filter.
        </p>
      )}
    </div>
  );
}
