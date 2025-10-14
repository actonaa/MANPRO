import React from "react";

interface AktivitasItem {
  tanggal: string;
  deskripsi: string;
  status: string;
}

interface RiwayatAktivitasProps {
  aktivitas: AktivitasItem[];
}

const RiwayatAktivitas: React.FC<RiwayatAktivitasProps> = ({ aktivitas }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Riwayat Aktivitas</h2>
      <ul className="space-y-3">
        {aktivitas.map((a, index) => (
          <li
            key={index}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
          >
            <p className="text-gray-800 font-medium">
              {a.tanggal} — {a.deskripsi} —{" "}
              <span className="font-semibold">{a.status}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RiwayatAktivitas;
