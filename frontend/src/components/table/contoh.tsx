/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Download, Upload, Plus } from "lucide-react";
import ExportModal from "../form/Admin/Export";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
}

export default function TableAset() {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    // Simulasi data dummy biar gak error fetch
    setTimeout(() => {
      setData([
        {
          id: "1",
          name: "Laptop Dell XPS 13",
          serial_number: "SN001",
          lokasi: "Kantor Utama",
          acquisition_date: "2023-06-01",
          category: { name: "Aset TI" },
          status: { name: "Aktif" },
        },
        {
          id: "2",
          name: "Printer Epson L3150",
          serial_number: "SN002",
          lokasi: "Ruang IT",
          acquisition_date: "2022-08-15",
          category: { name: "Aset Non TI" },
          status: { name: "Perbaikan" },
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-[#BBF7D0] text-[#166534]";
      case "Perbaikan":
        return "bg-yellow-200 text-yellow-800";
      case "Non-Aktif":
      case "Tidak Aktif":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // === Fungsi Export (langsung download file) ===
  const handleExport = (format: string) => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport.");
      return;
    }

    let fileContent = "";
    let mimeType = "";
    let fileName = "";

    switch (format) {
      case "CSV":
        fileContent =
          "ID,Nama,Serial Number,Kategori,Lokasi,Status,Tanggal Perolehan\n" +
          data
            .map(
              (item) =>
                `${item.id},"${item.name}",${item.serial_number},"${item.category?.name}","${item.lokasi}","${item.status?.name}",${item.acquisition_date}`
            )
            .join("\n");
        mimeType = "text/csv";
        fileName = "data-aset.csv";
        break;

      case "PDF":
        fileContent = "Export PDF dummy – ganti nanti dengan jsPDF";
        mimeType = "application/pdf";
        fileName = "data-aset.pdf";
        break;

      case "XLSX":
        fileContent = "Export Excel dummy – ganti nanti dengan SheetJS";
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileName = "data-aset.xlsx";
        break;

      default:
        return;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const HeaderSection = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 pt-5 pb-2 border-b border-gray-200 bg-transparent">
      <h2 className="text-[16px] font-semibold text-gray-800">Data Aset</h2>
      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Download className="w-4 h-4" />
          Ekspor
        </button>

        <button
          onClick={() => alert("Impor data (dummy)")}
          className="flex items-center gap-2 text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Upload className="w-4 h-4" />
          Impor
        </button>

        <button
          onClick={() => alert("Tambah Aset (dummy)")}
          className="flex items-center gap-2 text-white bg-[#0095E8] hover:bg-[#007ACC] rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Aset
        </button>
      </div>
    </div>
  );

  return (
    <div className="lg:rounded-b-xl lg:bg-white mt-6 border border-gray-200 shadow-sm rounded-2xl">
      <HeaderSection />

      {loading ? (
        <p className="text-center py-5 text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-center py-5 text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-[13px] text-center border-collapse bg-white">
            <thead className="text-[#666666]">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 font-semibold">ID ASET</th>
                <th className="py-4 px-4 font-semibold">NAMA ASET</th>
                <th className="py-4 px-4 font-semibold">KATEGORI</th>
                <th className="py-4 px-4 font-semibold">LOKASI</th>
                <th className="py-4 px-4 font-semibold">STATUS</th>
                <th className="py-4 px-4 font-semibold">TANGGAL PEROLEHAN</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4">{item.serial_number}</td>
                  <td className="py-4 px-4">{item.name}</td>
                  <td className="py-4 px-4">{item.category?.name}</td>
                  <td className="py-4 px-4">{item.lokasi}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status?.name || ""
                      )}`}
                    >
                      {item.status?.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">{item.acquisition_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
}
