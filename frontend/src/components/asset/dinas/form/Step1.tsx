import { type ChangeEvent } from "react";

export type AsetFormData = {
  namaAset: string;
  merkTipe: string;
  kodeBMD: string;
  tanggalPerolehan: string;
  indukAset: string;
  lokasiAset: string;
  penanggungJawab: string;
  kategoriAset: string;
  subKategori: string;
};

interface Step1Props {
  formData: AsetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AsetFormData>>;
  nextStep?: () => void;
}

export default function Step1({ formData, setFormData, nextStep }: Step1Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-xl font-semibold mb-4">
        Step 1 - Informasi Umum Aset
      </h2>

      {/* Nama Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Aset</label>
        <input
          type="text"
          name="namaAset"
          value={formData.namaAset}
          onChange={handleChange}
          placeholder="Masukkan Nama Aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Merk/Tipe */}
      <div>
        <label className="block text-sm font-medium mb-1">Merk / Tipe</label>
        <input
          type="text"
          name="merkTipe"
          value={formData.merkTipe}
          onChange={handleChange}
          placeholder="Masukkan Merk / Tipe"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Kode BMD */}
      <div>
        <label className="block text-sm font-medium mb-1">Kode BMD</label>
        <input
          type="text"
          name="kodeBMD"
          value={formData.kodeBMD}
          onChange={handleChange}
          placeholder="Masukkan kode BMD"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Tanggal Perolehan */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tanggal Perolehan
        </label>
        <input
          type="date"
          name="tanggalPerolehan"
          value={formData.tanggalPerolehan}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Induk Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">Induk Aset</label>
        <input
          type="text"
          name="indukAset"
          value={formData.indukAset}
          onChange={handleChange}
          placeholder="Masukkan Induk Aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Lokasi Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">Lokasi Aset</label>
        <input
          type="text"
          name="lokasiAset"
          value={formData.lokasiAset}
          onChange={handleChange}
          placeholder="Masukkan Lokasi Aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Penanggung Jawab */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Penanggung Jawab
        </label>
        <input
          type="text"
          name="penanggungJawab"
          value={formData.penanggungJawab}
          onChange={handleChange}
          placeholder="Masukkan Penanggung Jawab"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Kategori (TI / Non-TI) */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori Aset</label>
        <select
          name="kategoriAset"
          value={formData.kategoriAset}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Pilih kategori</option>
          <option value="TI">TI</option>
          <option value="Non-TI">Non-TI</option>
        </select>
      </div>

      {/* Sub Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Sub Kategori</label>
        <select
          name="subKategori"
          value={formData.subKategori}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={!formData.kategoriAset} // Nonaktif kalau kategori belum dipilih
        >
          <option value="">Pilih Sub Kategori</option>

          {formData.kategoriAset === "TI" && (
            <>
              <option value="Laptop">Laptop</option>
              <option value="PC Desktop">PC Desktop</option>
              <option value="Printer">Printer</option>
              <option value="Proyektor">Proyektor</option>
              <option value="Server">Server</option>
              <option value="Router">Router</option>
            </>
          )}

          {formData.kategoriAset === "Non-TI" && (
            <>
              <option value="Meja">Meja</option>
              <option value="Kursi">Kursi</option>
              <option value="Lemari">Lemari</option>
              <option value="Kendaraan">Kendaraan</option>
              <option value="Peralatan Kantor">Peralatan Kantor</option>
            </>
          )}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
