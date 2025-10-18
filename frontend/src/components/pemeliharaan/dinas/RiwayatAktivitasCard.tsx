export default function RiwayatAktivitasCard() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg  mb-4">Riwayat Aktivitas</h2>

      <ul className="space-y-3 text-sm text-gray-700">
        <li className="border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition">
          09 Okt 2025 — Perbaikan kipas chassis —{" "}
          <span className="text-gray-600 font-medium">Selesai</span>
        </li>
        <li className="border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition">
          02 Sep 2025 — Penggantian PSU —{" "}
          <span className="text-gray-600 font-medium">Selesai</span>
        </li>
        <li className="border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition">
          15 Jul 2025 — Pembersihan debu —{" "}
          <span className="text-gray-600 font-medium">Selesai</span>
        </li>
      </ul>
    </div>
  );
}
