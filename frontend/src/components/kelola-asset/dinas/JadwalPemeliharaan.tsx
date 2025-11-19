import React from "react";

interface JadwalItem {
  tanggal: string;
  kegiatan: string;
}

interface JadwalPemeliharaanProps {
  jadwal: JadwalItem[];
}

const JadwalPemeliharaan: React.FC<JadwalPemeliharaanProps> = ({ jadwal }) => {
  const formatTanggal = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="font-semibold text-lg mb-4">Jadwal Pemeliharaan</h2>

      {jadwal.length === 0 ||
      jadwal.every((item) => !item.tanggal && !item.kegiatan) ? (
        <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded border border-yellow-300">
          Belum di set jadwal pemeliharaan oleh verifikator
        </p>
      ) : (
        <ul className="space-y-3">
          {jadwal.map((item, index) => (
            <li
              key={index}
              className="px-5 py-3 border border-gray-200 rounded-xl text-gray-800 font-medium hover:shadow-sm transition"
            >
              {item.tanggal ? formatTanggal(item.tanggal) : "-"} —{" "}
              {item.kegiatan || "-"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JadwalPemeliharaan;
