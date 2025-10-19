type Aktivitas = {
  id: string;
  tanggal: string; // Format: YYYY-MM-DD
  deskripsi: string;
  status: string;
};

type RiwayatAktivitasCardProps = {
  aktivitasList?: Aktivitas[];
};

export default function RiwayatAktivitasCard({
  aktivitasList = [],
}: RiwayatAktivitasCardProps) {
  // 🗓️ Format tanggal jadi gaya lokal
  const formatTanggal = (tgl: string) => {
    if (!tgl) return "-";
    const date = new Date(tgl);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Riwayat Aktivitas</h2>

      {aktivitasList.length > 0 ? (
        <ul className="space-y-3">
          {aktivitasList.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-800"
            >
              {formatTanggal(item.tanggal)} — {item.deskripsi} —{" "}
              <span className="font-semibold text-green-600">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Belum ada aktivitas tercatat.</p>
      )}
    </div>
  );
}
