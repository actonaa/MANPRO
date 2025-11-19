import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonText from "../../components/button/ButtonText";
import { useRef, useState } from "react";
import DeleteSDMModal from "../../components/form/SDM/DeleteSDM";

export default function DetailSdmAuditor() {
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

    // ✅ ASET DITAMBAHKAN — bisa lebih dari 1
    aset: [
      {
        id: "AST - 001",
        nama: "ASUS ZENBOOK",
        nilai: "Rp21.500.000,00",
        jadwal: "10-11-2025",
        realisasi: "10-12-2025",
        risiko: "Kehilangan data akibat kegagalan hardware",
        lampiran: ["Invoice.pdf", "FotoAset.jpg", "Garansi.pdf"],
      },
      {
        id: "AST - 002",
        nama: "Pajero Sport",
        nilai: "Rp300.500.000,00",
        jadwal: "10-03-2025",
        realisasi: "10-04-2025",
        risiko: "Kehilangan data akibat kegagalan hardware",
        lampiran: ["Invoice.pdf", "FotoAset.jpg", "Garansi.pdf"],
      },
    ],
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      {/* PRINT STYLE */}
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

            /* Hilangkan scroll saat print */
            .aset-scroll {
              max-height: none !important;
              overflow: visible !important;
            }

            @page {
              size: A4;
              margin: 20mm;
            }
          }
        `}
      </style>

      <div className="">
        {/* BACK */}
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

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-xl md:text-2xl font-semibold">
            Detail Data Informasi SDM
          </h1>

          <div className="flex gap-3">
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

        {/* MAIN CARD */}
        <div
          id="print-area"
          ref={printRef}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
        >
          {/* DATA GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10">
            <Info label="Nama" value={data.nama} />
            <Info label="NIP" value={data.nip} />
            <Info label="Alamat" value={data.alamat} />
            <Info label="Jabatan" value={data.jabatan} />
            <Info label="Hak Akses Sistem" value={data.hakAkses} />
            <Info label="Dinas" value={data.dinas} />
            <Info label="Divisi" value={data.divisi} />
            <Info label="Seksi" value={data.seksi} />
            <Info label="Periode Kerja" value={data.periode} />
          </div>

          {/* LAMPIRAN SDM */}
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

          {/* ========================================================= */}
          {/*              ASET — BAGIAN DARI GAMBAR ANDA              */}
          {/* ========================================================= */}
          <div className="mt-12">
            <p className="font-semibold text-gray-800 mb-3">Aset yang Ditangani</p>

            <div className="aset-scroll max-h-80 overflow-y-auto pr-2 space-y-8">
              {data.aset.map((a, i) => (
                <div key={i} className="border-b pb-5">
                  {/* GRID 4 KOLOM */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <Info label="ID ASET" value={a.id} />
                    <Info label="Nama Aset" value={a.nama} />
                    <Info label="Nilai Aset" value={a.nilai} />
                    <Info label="Jadwal Pemeliharaan" value={a.jadwal} />
                    <Info label="Realisasi" value={a.realisasi} />

                  </div>

                  {/* RISIKO */}
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Skenario Risiko</p>
                    <p className="text-gray-800 font-medium">{a.risiko}</p>
                  </div>

                  {/* LAMPIRAN */}
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Lampiran</p>

                    <div className="flex flex-wrap gap-3 mt-1">
                      {a.lampiran.map((file, idx) => (
                        <span key={idx} className="text-blue-700 text-sm underline cursor-pointer">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold text-gray-900 text-[15px]">{value}</p>
    </div>
  );
}
