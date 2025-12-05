/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RiwayatAktivitasCard({ maintenance }: { maintenance: any }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak ada tanggal";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const aktivitas: any[] = [];

  // Ambil hanya aktivitas yang status-nya "selesai"
  if (maintenance.status === "selesai" && maintenance.completion_date) {
    aktivitas.push({
      tanggal: formatDate(maintenance.completion_date),
      aktivitas: "Pemeliharaan selesai",
      status: "selesai",
    });
  }

  return (
    <div className="bg-white p-5 h-full rounded-xl shadow-sm">
      <h2 className="text-lg mb-4">Riwayat Aktivitas</h2>

      {aktivitas.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada aktivitas selesai.</p>
      ) : (
        <ul className="space-y-3 text-sm text-gray-700">
          {aktivitas.map((item, index) => (
            <li
              key={index}
              className="border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition"
            >
              {item.tanggal} — {item.aktivitas} —{" "}
              <span className="text-gray-600 font-medium">{item.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
