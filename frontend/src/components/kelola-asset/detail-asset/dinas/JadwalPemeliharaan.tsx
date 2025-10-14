import React from "react";

interface JadwalItem {
  tanggal: string;
  kegiatan: string;
}

interface JadwalPemeliharaanProps {
  jadwal: JadwalItem[];
}

const JadwalPemeliharaan: React.FC<JadwalPemeliharaanProps> = ({ jadwal }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Jadwal Pemeliharaan</h2>

      <ul className="space-y-3">
        {jadwal.map((item, index) => (
          <li
            key={index}
            className="px-5 py-3 border border-gray-200 rounded-xl text-gray-800 font-medium hover:shadow-sm transition"
          >
            {item.tanggal} — {item.kegiatan}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JadwalPemeliharaan;
