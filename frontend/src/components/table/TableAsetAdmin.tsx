import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Download } from "lucide-react";
import ButtonImg from "../../components/button/ButtonImg";

// Import modal
import ExportModal from "../../components/form/Admin/Export"; 
import ImportModal from "../../components/form/Admin/Import";


export interface AsetItem {
  id: number;
  kode_aset: string;
  nama_aset: string;
  kategori: string;
  lokasi: string;
  status_aset: "Aktif" | "Perbaikan" | "Tidak Aktif";
  status_pengajuan: "Diterima" | "Menunggu" | "Ditolak";
  tanggal_perolehan: string;
  dinas: string;
}

interface TableAsetAdminProps {
  data: AsetItem[];
}

export default function TableAsetAdmin({ data }: TableAsetAdminProps) {
  const navigate = useNavigate();

  // STATE POPUP
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  const handleNavigate = () => {
    navigate("/admin/aset/tambah");
  };

  // Hasil export
  const handleExport = (format: string) => {
    console.log("Export format:", format);
  };

  // Hasil import
  const handleImport = (file: File) => {
    console.log("Imported file:", file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      {/* HEADER */}
      <div className="flex justify-between border-b border-gray-300 py-4 items-center mb-4">
        <h2 className="text-lg font-semibold">Data Aset</h2>

        <div className="flex items-center gap-2">
          {/* === BUTTON EXPORT === */}
          <button
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50"
            onClick={() => setOpenExport(true)}
          >
            <Upload size={16} /> Ekspor
          </button>

          {/* === BUTTON IMPORT === */}
          <button
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50"
            onClick={() => setOpenImport(true)}
          >
            <Download size={16} /> Impor
          </button>

          <ButtonImg
            title="Tambah Aset"
            img="/kelola-asset/tambah-asset.png"
            color="#00a9ff"
            hoverColor="#a0e9ff"
            borderColor="#00a9ff"
            textColor="white"
            px="6"
            fontWeight="font-medium"
            onClick={handleNavigate}
          />
        </div>
      </div>

      {/* TABLE DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[950px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr className="border-b-gray-300 border-b bg-gray-50">
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">STATUS ASET</th>
              <th className="py-5 px-4 font-semibold">STATUS PENGAJUAN</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
              <th className="py-5 px-4 font-semibold">DINAS</th>
              <th className="py-5 px-4 font-semibold">AKSI</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: AsetItem) => (
              <tr
                key={item.id}
                className="border-b-gray-300 border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 text-sm font-medium text-gray-700">
                  {item.kode_aset}
                </td>

                <td className="p-4 text-sm text-gray-800">{item.nama_aset}</td>
                <td className="p-4 text-sm text-gray-800">{item.kategori}</td>
                <td className="p-4 text-sm text-gray-800">{item.lokasi}</td>

                {/* STATUS ASET */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semi ${
                      item.status_aset === "Aktif"
                        ? "bg-green-100 text-green-700"
                        : item.status_aset === "Perbaikan"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status_aset}
                  </span>
                </td>

                {/* STATUS PENGAJUAN */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semi ${
                      item.status_pengajuan === "Diterima"
                        ? "bg-green-100 text-green-700"
                        : item.status_pengajuan === "Menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status_pengajuan}
                  </span>
                </td>

                <td className="p-4 text-sm text-gray-800">
                  {item.tanggal_perolehan}
                </td>

                <td className="p-4 text-sm text-gray-800">{item.dinas}</td>

                {/* DETAIL */}
                <td className="p-4">
                  <button
                    onClick={() =>
                      navigate(`/aset-admin/:id${item.id}`)
                    }
                    className="text-blue-600 hover:underline text-sm font-semi"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD */}
      <div className="md:hidden space-y-4 mt-4">
        {data.map((item: AsetItem) => (
          <div
            key={item.id}
            className="p-4 border rounded-xl shadow-sm bg-white"
          >
            <div className="font-semi text-gray-800 mb-1">
              {item.nama_aset}
            </div>
            <div className="text-sm text-gray-600 mb-2">{item.kode_aset}</div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Kategori</div>
              <div>{item.kategori}</div>

              <div className="text-gray-500">Lokasi</div>
              <div>{item.lokasi}</div>

              <div className="text-gray-500">Status Aset</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semi ${
                    item.status_aset === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : item.status_aset === "Perbaikan"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status_aset}
                </span>
              </div>

              <div className="text-gray-500">Status Pengajuan</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semi ${
                    item.status_pengajuan === "Diterima"
                      ? "bg-green-100 text-green-700"
                      : item.status_pengajuan === "Menunggu"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status_pengajuan}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/aset-admin/:id${item.id}`)
              }
              className="mt-3 text-blue-600 font-semi text-sm"
            >
              Detail →
            </button>
          </div>
        ))}
      </div>

      {/* ===========================
          MODAL EXPORT & IMPORT
      ============================ */}
      <ExportModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        onExport={handleExport}
      />

      <ImportModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        onImport={handleImport}
      />
    </div>
  );
}
