import React from "react";

interface LampiranItem {
  nama: string;
  url: string;
}

interface LampiranProps {
  lampiran: LampiranItem[];
  invoice?: LampiranItem[];
}

const Lampiran: React.FC<LampiranProps> = ({ lampiran, invoice = [] }) => {
  const wajibLampiran = [{ nama: "FotoAset.jpg", ext: "jpg" }];

  const finalLampiran = wajibLampiran.map((item) => {
    const found = lampiran.find((file) => {
      const ext = file.nama.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png"].includes(ext || "");
      return ext === item.ext || (item.ext === "jpg" && isImage);
    });

    return found || { nama: item.nama, url: "#" };
  });

  const allowedInvoiceExt = ["pdf", "jpg", "jpeg", "png"];
  const invoiceFiles = invoice.filter((file) => {
    const ext = file.nama.split(".").pop()?.toLowerCase();
    return allowedInvoiceExt.includes(ext || "");
  });

  const getFileIcon = (nama: string) => {
    const ext = nama.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📄";
    if (["jpg", "jpeg", "png"].includes(ext || "")) return "🖼️";
    return "📁";
  };

  // CEK jika semua lampiran kosong
  const allEmpty =
    invoiceFiles.length === 0 && finalLampiran.every((f) => f.url === "#");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Lampiran</h2>

      {/* Jika kosong */}
      {allEmpty ? (
        <div className="text-center text-gray-500 py-6">
          Lampiran masih kosong
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Invoice */}
          {invoiceFiles.map((file, idx) => (
            <a
              key={`invoice-${idx}`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <span className="text-xl">{getFileIcon(file.nama)}</span>
              <span className="font-semibold text-gray-800">
                Bukti Pembayaran {idx + 1}
              </span>
            </a>
          ))}

          {/* Foto Aset */}
          {finalLampiran.map((file, index) => (
            <a
              key={`lampiran-${index}`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <span className="text-xl">{getFileIcon(file.nama)}</span>
              <span className="font-semibold text-gray-800">{file.nama}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lampiran;
