export default function SiklusHidupCard() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Siklus Hidup</h2>

      <ul className="text-sm text-gray-700">
        <li className="flex items-center gap-3 py-2 border-b border-gray-200">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Pengadaan (2021-12-10)</span>
        </li>

        <li className="flex items-center gap-3 py-2 border-b border-gray-200">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>Penggunaan (2022-01-05)</span>
        </li>

        <li className="flex items-center gap-3 py-2 border-b border-gray-200">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span>Pemeliharaan Berkala (3 bln)</span>
        </li>

        <li className="flex items-center gap-3 py-2 border-b border-gray-200">
          <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
          <span>Penghapusan (Estimasi 2027)</span>
        </li>
      </ul>
    </div>
  );
}
