import React from "react";

interface SiklusItem {
  tahap: string;
  tanggal: string;
}

interface SiklusHidupProps {
  siklus: SiklusItem[];
}

const getColorClass = (tahap: string) => {
  switch (tahap.toLowerCase()) {
    case "pengadaan":
      return "bg-green-500";
    case "penggunaan":
      return "bg-blue-500";
    case "pemeliharaan berkala":
      return "bg-orange-500";
    case "penghapusan":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

const SiklusHidup: React.FC<SiklusHidupProps> = ({ siklus }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Siklus Hidup</h2>

      <ul className="divide-y divide-gray-200">
        {siklus.map((item, index) => (
          <li key={index} className="flex items-center gap-3 py-3">
            {/* 🔵 Titik warna */}
            <span
              className={`w-4 h-4 rounded-full ${getColorClass(item.tahap)}`}
            ></span>

            {/* 🔤 Tahap + Tanggal dari props */}
            <p className="text-gray-800 font-semibold">
              {item.tahap}{" "}
              <span className="text-gray-500 font-normal">
                ({item.tanggal})
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SiklusHidup;
