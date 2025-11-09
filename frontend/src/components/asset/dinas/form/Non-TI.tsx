import { type ChangeEvent } from "react";

export type FormDataNonTI = {
  material: string;
  ukuran: string;
  tanggalPerolehan: string;
  nilaiAset: string;
  kondisi: string[];
  vendor: string;
  lokasiPenyimpanan: string;
  masaPakai: string;
};

interface StepNonTIProps {
  formData: FormDataNonTI;
  setFormData: React.Dispatch<React.SetStateAction<FormDataNonTI>>;
  nextStep?: () => void;
  prevStep?: () => void;
}

export default function StepNonTI({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: StepNonTIProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (value: string) => {
    setFormData((prev) => {
      const kondisi = [...prev.kondisi];

      // Jika pilih "Baik", hapus semua kondisi lain dan hanya simpan "Baik"
      if (value === "Baik") {
        return {
          ...prev,
          kondisi: kondisi.includes("Baik") ? [] : ["Baik"],
        };
      }

      // Jika pilih "Rusak", hapus "Baik" dan toggle "Rusak"
      if (value === "Rusak") {
        const newKondisi = kondisi.includes("Rusak")
          ? kondisi.filter((item) => item !== "Rusak")
          : [...kondisi.filter((item) => item !== "Baik"), "Rusak"];
        return { ...prev, kondisi: newKondisi };
      }

      // Jika pilih "Ringan" atau "Berat", aktif hanya jika "Rusak" sudah dipilih
      if (!kondisi.includes("Rusak")) {
        // Tidak bisa pilih ringan/berat tanpa "Rusak"
        return prev;
      }

      const exists = kondisi.includes(value);
      const newKondisi = exists
        ? kondisi.filter((item) => item !== value)
        : [...kondisi, value];
      return { ...prev, kondisi: newKondisi };
    });
  };

  const isRusak = formData.kondisi.includes("Rusak");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-lg font-semibold mb-2">Unggah Dokumen</h2>

      {/* Material / Bahan */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Material / Bahan
        </label>
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder="Masukkan material / bahan aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Ukuran / Spesifikasi */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ukuran / Spesifikasi
        </label>
        <input
          type="text"
          name="ukuran"
          value={formData.ukuran}
          onChange={handleChange}
          placeholder="Masukkan ukuran / spesifikasi aset"
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

      {/* Nilai Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">Nilai Aset</label>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Rp</span>
          <input
            type="number"
            name="nilaiAset"
            value={formData.nilaiAset}
            onChange={handleChange}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Kondisi Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">Kondisi Aset</label>
        <div className="grid grid-cols-2 gap-4">
          {/* Kolom kiri */}
          <div className="space-y-2 border border-gray-300 rounded-lg p-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.kondisi.includes("Baik")}
                onChange={() => handleCheckbox("Baik")}
              />
              Baik
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.kondisi.includes("Rusak")}
                onChange={() => handleCheckbox("Rusak")}
              />
              Rusak
            </label>
          </div>

          {/* Kolom kanan */}
          <div
            className={`space-y-2 border border-gray-300 rounded-lg p-3 ${
              !isRusak ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.kondisi.includes("Ringan")}
                onChange={() => handleCheckbox("Ringan")}
                disabled={!isRusak}
              />
              Ringan
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.kondisi.includes("Berat")}
                onChange={() => handleCheckbox("Berat")}
                disabled={!isRusak}
              />
              Berat
            </label>
          </div>
        </div>
      </div>

      {/* Vendor */}
      <div>
        <label className="block text-sm font-medium mb-1">Vendor</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          placeholder="Masukkan vendor aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Lokasi Penyimpanan */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Lokasi Penyimpanan
        </label>
        <input
          type="text"
          name="lokasiPenyimpanan"
          value={formData.lokasiPenyimpanan}
          onChange={handleChange}
          placeholder="Masukkan lokasi penyimpanan aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Masa Pakai */}
      <div>
        <label className="block text-sm font-medium mb-1">Masa Pakai</label>
        <input
          type="text"
          name="masaPakai"
          value={formData.masaPakai}
          onChange={handleChange}
          placeholder="Masukkan masa pakai aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Tombol Navigasi */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
