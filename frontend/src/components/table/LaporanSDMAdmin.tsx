import { useState } from "react";
import { Link } from "react-router-dom";
import Export from "../../components/dropdown/Export";
import { Download } from "lucide-react";

interface SDM {
  nip: string;
  nama: string;
  jabatan: string;
  dinas: string;
  periodeKerja: string;
}

export default function TabelSDM({ data }: { data: SDM[] }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div className="lg:rounded-b-xl lg:bg-white mt-6 border border-gray-200 shadow-sm rounded-2xl">
      {/* ========================================================= */}
      {/*                 EXPORT BAR — MOBILE VERSION              */}
      {/* ========================================================= */}
      <div className="lg:hidden p-4 pb-0">
        <button
          onClick={() => setShowExportModal(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md border w-full transition
            ${
              hover
                ? "bg-gray-100 border-gray-400 text-gray-800"
                : "bg-white border-gray-300 text-gray-600"
            }`}
        >
          <Download
            className={`w-4 h-4 ${hover ? "text-gray-800" : "text-gray-600"}`}
          />
          <span className={hover ? "text-gray-800" : "text-gray-600"}>
            Export
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/*                 MOBILE CARD VIEW (TIDAK DIUBAH)          */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:hidden space-y-4 mt-4">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.nip}
              className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <p className="text-[15px] text-gray-500 font-medium">
                  {item.nip}
                </p>

                <Link
                  to="/sdm-admin-id"
                  className="text-[#0095E8] font-medium text-[15px] hover:underline"
                >
                  Detail
                </Link>
              </div>

              <h2 className="text-[16px] font-semibold text-gray-900 mt-1">
                {item.nama}
              </h2>

              <hr className="my-3 border-gray-200" />

              <div className="space-y-1 text-[15px] text-gray-600">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-500">Jabatan</span>
                  <span>{item.jabatan}</span>
                </p>

                <p className="flex justify-between">
                  <span className="font-medium text-gray-500">Dinas</span>
                  <span>{item.dinas}</span>
                </p>

                <p className="flex justify-between">
                  <span className="font-medium text-gray-500">Periode</span>
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

      {/* ========================================================= */}
      {/*                    DESKTOP VIEW                           */}
      {/* ========================================================= */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-b-xl">
        {/* HEADER EXPORT */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-[16px] font-semibold text-gray-800">
            Data Sumber Daya Manusia
          </h2>

          <button
            onClick={() => setShowExportModal(true)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`flex items-center gap-2 py-2 px-4 rounded-md border transition
              ${
                hover
                  ? "bg-gray-100 border-gray-400 text-gray-800"
                  : "bg-white border-gray-300 text-gray-600"
              }`}
          >
            <Download
              className={`w-4 h-4 ${hover ? "text-gray-800" : "text-gray-600"}`}
            />
            <span className={hover ? "text-gray-800" : "text-gray-600"}>
              Export
            </span>
          </button>
        </div>

        {/* TABLE — TIDAK DIUBAH */}
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
                <td className="py-5 px-4 font-semibold text-[#444]">
                  {item.nip}
                </td>
                <td className="py-5 px-4 text-[#444]">{item.nama}</td>
                <td className="py-5 px-4 text-[#444]">{item.jabatan}</td>
                <td className="py-5 px-4 text-[#444]">{item.dinas}</td>
                <td className="py-5 px-4 text-[#444]">{item.periodeKerja}</td>

                <td className="py-5 px-4">
                  <Link
                    to="/sdm-admin-id"
                    className="text-[#0095E8] text-sm hover:underline"
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

      {/* ========================================================= */}
      {/*                       MODAL EXPORT                        */}
      {/* ========================================================= */}
      {showExportModal && (
        <Export
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={() => console.log("Export SDM:", data)}
        />
      )}
    </div>
  );
}
