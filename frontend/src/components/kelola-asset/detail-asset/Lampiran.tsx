import React from "react";

interface LampiranItem {
  nama: string;
  url: string;
}

interface LampiranProps {
  lampiran: LampiranItem[];
}

const Lampiran: React.FC<LampiranProps> = ({ lampiran }) => {
  const wajibLampiran = ["Invoice.pdf", "FotoAset.jpg", "Garansi.pdf"];

  const finalLampiran = wajibLampiran.map((nama) => {
    const existing = lampiran.find((l) => l.nama === nama);
    return (
      existing || {
        nama,
        url: "#",
      }
    );
  });

  const getFileIcon = (nama: string) => {
    const ext = nama.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📄";
    if (["jpg", "jpeg", "png"].includes(ext || "")) return "🖼️";
    return "📁";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Lampiran</h2>

      <div className="flex flex-wrap gap-4">
        {finalLampiran.map((file, index) => (
          <a
            key={index}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full hover:shadow-md transition"
          >
            <span className="text-xl">{getFileIcon(file.nama)}</span>
            <span className="font-semibold text-gray-800">{file.nama}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Lampiran;
