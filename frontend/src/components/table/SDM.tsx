import { Download, Upload, Plus } from "lucide-react";
import ExportModal from "../form/Admin/Export";
import ImportModal from "../form/Admin/Import";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SDM {
  nip: string;
  nama: string;
  jabatan: string;
  dinas: string;
  periodeKerja: string;
}

export default function TabelSDM({ data }: { data: SDM[] }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="lg:rounded-b-xl lg:bg-white mt-6 border border-gray-200 shadow-sm rounded-2xl">

      {/* === HEADER BUTTON === */}
      <div className="flex justify-end items-center gap-2 p-4 bg-white border-b border-gray-200 rounded-t-2xl">
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 text-[#444] border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-[14px] font-medium"
        >
          <Download className="w-4 h-4" />
          Ekspor
        </button>

        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 text-[#444] border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-[14px] font-medium"
        >
          <Upload className="w-4 h-4" />
          Impor
        </button>

        <Link
          to="/sdm-admin-tambah"
          className="flex items-center gap-2 text-white bg-[#0095E8] hover:bg-[#007ACC] rounded-lg px-4 py-2 text-[14px] font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah SDM
        </Link>
      </div>

      {/* === MOBILE VIEW === */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:hidden space-y-4 mt-5 md:mt-0">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.nip}
              className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white"
            >
              {/* NIP + DETAIL */}
              <div className="flex justify-between items-center">
                <p className="text-[15px] text-gray-600 font-medium">{item.nip}</p>

                <Link
                  to="/sdm-admin-id"
                  className="text-[#0095E8] font-medium text-[15px] hover:underline"
                >
                  Detail
                </Link>
              </div>

              {/* NAMA */}
              <h2 className="text-[16px] font-semibold text-gray-900 mt-1">
                {item.nama}
              </h2>

              <hr className="my-3 border-gray-200" />

              {/* INFORMASI */}
              <div className="space-y-1 text-[15px] text-gray-700">
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Jabatan</span>
                  <span>{item.jabatan}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Dinas</span>
                  <span>{item.dinas}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Periode</span>
                  <span>{item.periodeKerja}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data SDM tersedia.
          </p>
        )}
      </div>

      {/* === DESKTOP TABLE === */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-b-xl">
        <table className="w-full text-[14px] border-collapse text-center">
          <thead className="text-[#555]">
            <tr>
              <th className="py-5 px-4 font-semibold">NIP</th>
              <th className="py-5 px-4 font-semibold">NAMA</th>
              <th className="py-5 px-4 font-semibold">JABATAN</th>
              <th className="py-5 px-4 font-semibold">DINAS</th>
              <th className="py-5 px-4 font-semibold">PERIODE KERJA</th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.nip}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-5 px-4 font-semibold text-[#444]">{item.nip}</td>
                <td className="py-5 px-4 text-[#444]">{item.nama}</td>
                <td className="py-5 px-4 text-[#444]">{item.jabatan}</td>
                <td className="py-5 px-4 text-[#444]">{item.dinas}</td>
                <td className="py-5 px-4 text-[#444]">{item.periodeKerja}</td>
                <td className="py-5 px-4">
                  <Link
                    to="/sdm-admin-id"
                    className="text-[#0095E8] text-[14px] hover:underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4">
          <p className="text-[14px] text-gray-600">
            Menampilkan {data.length} hasil
          </p>
        </div>
      </div>

      {/* === MODALS === */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={() => console.log("Export SDM: ", data)}
        />
      )}

      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={(file) => console.log("Import SDM:", file)}
        />
      )}
    </div>
  );
}
