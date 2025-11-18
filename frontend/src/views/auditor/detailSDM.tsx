import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonText from "../../components/button/ButtonText";
import { useRef, useState } from "react";
import DeleteSDMModal from "../../components/form/SDM/DeleteSDM";

export default function DetailSDM() {
  const navigate = useNavigate();
  const printRef = useRef(null);

  const handleExport = () => {
    window.print();
  };

  const data = {
    nama: "Lana Del Rey",
    nip: "22051214115",
    alamat: "Jln. Ketintang",
    telp: "082392932932",
    jabatan: "Kepala Departemen",
    hakAkses: "Admin",
    dinas: "DISKOMINFO",
    divisi: "Departemen Teknologi Informasi",
    seksi: "Kepala Departemen",
    periode: "10/12/2025 - 10/12/2026",
    lampiran: [
      { name: "Invoice.pdf", type: "pdf" },
      { name: "FotoAset.jpg", type: "jpg" },
      { name: "Garansi.pdf", type: "pdf" },
    ],
    keahlian: ["Sertifikasi Keamanan Informasi (ISO 27001)", "BNSP"],
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      {/* CSS PRINT SECTION */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }

            button, a {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 20mm;
            }
          }
        `}
      </style>

      <div className="p-4 md:p-6 lg:p-10">
        {/* BACK + BREADCRUMB */}
        <div className="flex items-center gap-2 mb-4 no-print">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <span className="text-sm text-gray-500">
            Kelola aset / Data SDM /{" "}
            <span className="text-gray-900 font-medium">Detail SDM</span>
          </span>
        </div>

        {/* HEADER TITLE */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-xl md:text-2xl font-semibold">
            Detail Data Informasi SDM
          </h1>

          {/* BUTTONS */}
          <div className="flex flex-row items-center justify-center gap-3">
            <button onClick={handleExport}>
              <ButtonText
                title="Ekspor"
                color="bg-white"
                hoverColor="hover:bg-gray-100"
                textColor="text-gray-700"
                fontWeight="font-medium"
              />
            </button>
          </div>
        </div>

        {/* MAIN CARD — PRINT ONLY */}
        <div
          id="print-area"
          ref={printRef}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
        >
          {/* GRID INFORMASI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10">
            <div>
              <p className="text-gray-500 text-sm">Nama</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.nama}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">NIP</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.nip}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Alamat</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.alamat}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Jabatan</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.jabatan}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Hak Akses Sistem</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.hakAkses}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Dinas</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.dinas}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Divisi</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.divisi}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Seksi</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.seksi}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Periode Kerja</p>
              <p className="font-semibold text-gray-900 text-[15px]">
                {data.periode}
              </p>
            </div>
          </div>

          {/* LAMPIRAN */}
          <div className="mt-12">
            <p className="font-medium text-gray-700 mb-3">Lampiran</p>

            <div className="flex flex-wrap gap-5">
              {data.lampiran.map((file, i) => (
                <div
                  key={i}
                  className="w-[210px] h-[130px] border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="text-[32px]">
                    {file.type === "pdf" && "📄"}
                    {file.type === "jpg" && "🖼️"}
                  </div>
                  <p className="text-gray-700 text-sm font-medium truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* KEAHLIAN */}
          <div className="mt-10">
            <p className="font-medium text-gray-700 mb-3">Keahlian</p>

            <div className="flex flex-wrap gap-3">
              {data.keahlian.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 text-sm rounded-full bg-green-100 text-green-700 border border-green-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <DeleteSDMModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={(reason) => {
            console.log("Alasan hapus:", reason);
            alert("SDM berhasil dihapus (dummy)");
            setShowDeleteModal(false);
          }}
        />
      </div>
    </>
  );
}
