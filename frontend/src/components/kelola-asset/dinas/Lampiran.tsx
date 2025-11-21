import React from "react";

interface LampiranItem {
  nama: string;
  url: string;
}

interface LampiranProps {
  lampiran: LampiranItem[];
}

const Lampiran: React.FC<LampiranProps> = ({ lampiran }) => {
  // daftar lampiran wajib
  const wajibLampiran = [
    { nama: "Invoice.pdf", ext: "pdf" },
    { nama: "FotoAset.jpg", ext: "jpg" },
    { nama: "Garansi.pdf", ext: "pdf" },
  ];

  // lakukan kecocokan berdasarkan EXTENSI
  const finalLampiran = wajibLampiran.map((item) => {
    const found = lampiran.find((l) => {
      const ext = l.nama.split(".").pop()?.toLowerCase();
      return (
        ext === item.ext ||
        (item.ext === "jpg" && ["png", "jpeg", "jpg"].includes(ext || ""))
      );
    });

    return found || { nama: item.nama, url: "#" };
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

      <div className="flex flex-col md:flex-row gap-4">
        {finalLampiran.map((file, index) => (
          <a
            key={index}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full gap-2 px-5 py-2 border border-gray-200 rounded-full hover:shadow-md transition"
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
