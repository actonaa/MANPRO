import React from "react";

interface LampiranItem {
  nama: string;
  url: string;
}

interface LampiranProps {
  lampiranAset?: string | string[] | null; // bisa 1 atau banyak
  lampiranPemeliharaan?: string | string[] | null; // bisa 1 atau banyak
}

const LampiranCard: React.FC<LampiranProps> = ({
  lampiranAset,
  lampiranPemeliharaan,
}) => {
  // -------------------------------
  // Normalisasi agar semuanya menjadi array
  // -------------------------------
  const asetArray: string[] = Array.isArray(lampiranAset)
    ? lampiranAset
    : lampiranAset
    ? [lampiranAset]
    : [];

  const invoiceArray: string[] = Array.isArray(lampiranPemeliharaan)
    ? lampiranPemeliharaan
    : lampiranPemeliharaan
    ? [lampiranPemeliharaan]
    : [];

  // -------------------------------
  // Konversi ke LampiranItem
  // -------------------------------
  const assetFiles: LampiranItem[] = asetArray.map((url) => ({
    nama: url.split("/").pop() || "FotoAset",
    url,
  }));

  const invoiceFiles: LampiranItem[] = invoiceArray.map((url) => ({
    nama: url.split("/").pop() || "BuktiPembayaran",
    url,
  }));

  // -------------------------------
  // Icon file
  // -------------------------------
  const getFileIcon = (nama: string) => {
    const ext = nama.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📄";
    if (["jpg", "jpeg", "png"].includes(ext || "")) return "🖼️";
    return "📁";
  };

  // Cek apakah semua kosong
  const allEmpty = assetFiles.length === 0 && invoiceFiles.length === 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="font-semibold text-lg mb-4">Lampiran</h2>

      {allEmpty ? (
        <div className="text-center text-gray-500 py-6">
          Lampiran masih kosong
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ---------------------- */}
          {/* Bukti Pembayaran */}
          {/* ---------------------- */}
          {invoiceFiles.map((file, i) => (
            <a
              key={`invoice-${i}`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <span className="text-xl">{getFileIcon(file.nama)}</span>
              <span className="font-semibold text-gray-800">
                Bukti Pembayaran {invoiceFiles.length > 1 ? i + 1 : ""}
              </span>
            </a>
          ))}

          {/* ---------------------- */}
          {/* Foto Aset */}
          {/* ---------------------- */}
          {assetFiles.map((file, i) => (
            <a
              key={`aset-${i}`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <span className="text-xl">{getFileIcon(file.nama)}</span>
              <span className="font-semibold text-gray-800">
                Foto Aset {assetFiles.length > 1 ? i + 1 : ""}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default LampiranCard;
