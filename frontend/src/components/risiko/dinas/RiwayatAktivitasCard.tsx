export default function RiwayatAktivitasCard() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg  text-black mb-4">Riwayat Aktivitas</h2>

      <ul className="space-y-3">
        <li className="border border-gray-200 rounded-md px-4 py-2 bg-white  text-black">
          09 Okt 2025 — Perbaikan kipas chassis — Selesai
        </li>
        <li className="border border-gray-200 rounded-md px-4 py-2 bg-white  text-black">
          02 Sep 2025 — Penggantian PSU — Selesai
        </li>
        <li className="border border-gray-200 rounded-md px-4 py-2 bg-white text-black">
          15 Jul 2025 — Pembersihan debu — Selesai
        </li>
      </ul>
    </div>
  );
}
