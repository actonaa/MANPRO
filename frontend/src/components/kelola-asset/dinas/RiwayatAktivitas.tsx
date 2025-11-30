import React from "react";

interface AktivitasItem {
  tanggal: string;
  kegiatan: string;
  status: string;
}

interface RiwayatAktivitasProps {
  act: AktivitasItem[] | null;
}

const RiwayatAktivitas: React.FC<RiwayatAktivitasProps> = ({ act }) => {
  const formatTanggal = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    const isSelesai = status?.toLowerCase() === "selesai";

    return isSelesai
      ? " border-blue-400 text-blue-700"
      : " border-yellow-400 text-yellow-700";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="font-semibold text-lg mb-4">Riwayat Aktivitas</h2>

      {/* Kondisi jika tidak ada data */}
      {!act || act.length === 0 ? (
        <div className="text-gray-500 italic text-center py-4">
          Tidak ada riwayat aktivitas.
        </div>
      ) : (
        <ul className="space-y-3">
          {act.map((item, index) => (
            <li
              key={index}
              className={`px-5 py-3 border rounded-xl font-medium hover:shadow-sm transition ${getStatusStyle(
                item.status
              )}`}
            >
              {item.tanggal ? formatTanggal(item.tanggal) : "-"} —{" "}
              {item.kegiatan || "-"} — {item.status || "-"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RiwayatAktivitas;
