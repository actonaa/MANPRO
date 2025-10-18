export default function AgendaPemeliharaanCard() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg  mb-4">Agenda Pemeliharaan</h2>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Jenis Pemeliharaan */}
        <div className="flex flex-col">
          <label className="block mb-2 text-gray-500 ">Jenis</label>
          <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400">
            <option className="text-gray-400">Jenis Pemeliharaan</option>
          </select>
        </div>

        {/* Tanggal Realisasi */}
        <div className="flex flex-col">
          <label className="block mb-2 text-gray-500 ">Tanggal Realisasi</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            placeholder="mm/dd/yyyy"
          />
        </div>

        {/* Biaya */}
        <div className="flex flex-col">
          <label className="block mb-2 text-gray-500">Biaya</label>
          <input
            type="text"
            placeholder="Rp 0"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </form>
    </div>
  );
}
