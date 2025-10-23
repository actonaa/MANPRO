import { Upload } from "lucide-react";

export default function AgendaPemeliharaanCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">
        Agenda Pemeliharaan
      </h2>

      <form className="space-y-6 text-sm">
        {/* Grid Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jenis Pemeliharaan */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">
              Jenis Pemeliharaan
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800">
              <option value="" disabled selected>
                Pilih jenis pemeliharaan
              </option> 
              <option value="rutin">Rutin</option>
              <option value="insidental">Insidental</option>
            </select>
          </div>

          {/* Tanggal Realisasi */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">
              Tanggal Realisasi
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          {/* Biaya */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">Biaya</label>
            <input
              type="text"
              placeholder="Rp 0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Unggah Bukti */}
        <div className="flex flex-col">
          <label className="block mb-2 text-gray-600 font-medium">
            Unggah Bukti
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Unggah Dokumen
            </button>
            <p className="text-sm text-gray-500 mt-3">
              File dengan ukuran kurang dari 1 MB
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
