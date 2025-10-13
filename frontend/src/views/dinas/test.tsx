import { useState, type ChangeEvent } from "react";
import LayoutDinas from "../layout/LayoutDinas";

interface FormData {
  // Step 1
  namaAset: string;
  merkTipe: string;
  serialNumber: string;
  tanggalPerolehan: string;
  kondisi: string[];
  nilaiAset: string;

  // Step 2
  namaDinas: string;
  kategoriAset: string;
  subKategori: string;
  lokasiAset: string;
  penanggungJawab: string;
  kodeBMD: string;
  dokumen: File | null;
}

export default function AssetWizard() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    namaAset: "",
    merkTipe: "",
    serialNumber: "",
    tanggalPerolehan: "",
    kondisi: [],
    nilaiAset: "",
    namaDinas: "",
    kategoriAset: "",
    subKategori: "",
    lokasiAset: "",
    penanggungJawab: "",
    kodeBMD: "",
    dokumen: null,
  });

  // Gambar indikator wizard
  const stepImages = [
    "/wizard/step1.png",
    "/wizard/step2.png",
    "/wizard/step3.png",
  ];

  // Handle perubahan input teks
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox kondisi aset
  const handleCheckbox = (value: string) => {
    setFormData((prev) => {
      const updated = prev.kondisi.includes(value)
        ? prev.kondisi.filter((item) => item !== value)
        : [...prev.kondisi, value];
      return { ...prev, kondisi: updated };
    });
  };

  // Handle upload dokumen
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, dokumen: file });
  };

  // Navigasi step
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <LayoutDinas>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Wizard */}
      <div className="flex flex-col w-full">
        <h1 className="text-2xl font-semibold mb-6">Tambah Aset</h1>
        <div className="flex items-center justify-center">
             <img
          src={stepImages[step - 1]}
          alt={`Step ${step}`}
          className="w-full max-w-xl mb-8 object-contain"
        />
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-md rounded-2xl p-6 w-full">
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="font-medium">Nama Aset</label>
                <input
                  type="text"
                  name="namaAset"
                  placeholder="Masukkan Nama Aset"
                  value={formData.namaAset}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Merk/Tipe Aset</label>
                <input
                  type="text"
                  name="merkTipe"
                  placeholder="Masukkan Merk / Tipe Aset"
                  value={formData.merkTipe}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Serial Number Aset</label>
                <input
                  type="text"
                  name="serialNumber"
                  placeholder="Masukkan Nomor Serial Aset"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Tanggal Perolehan Aset</label>
                <input
                  type="date"
                  name="tanggalPerolehan"
                  value={formData.tanggalPerolehan}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Kondisi Aset</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Baik", "Rusak", "Ringan", "Berat"].map((kondisi) => (
                    <label
                      key={kondisi}
                      className="flex items-center border rounded-lg px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.kondisi.includes(kondisi)}
                        onChange={() => handleCheckbox(kondisi)}
                        className="mr-2"
                      />
                      {kondisi}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="font-medium">Nilai Aset</label>
                <input
                  type="number"
                  name="nilaiAset"
                  placeholder="Rp 0"
                  value={formData.nilaiAset}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="font-medium">Nama Dinas</label>
                <input
                  type="text"
                  name="namaDinas"
                  placeholder="Masukkan Nama Dinas"
                  value={formData.namaDinas}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Kategori Aset</label>
                <select
                  name="kategoriAset"
                  value={formData.kategoriAset}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Pilih kategori</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Furnitur">Furnitur</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="font-medium">Sub Kategori</label>
                <select
                  name="subKategori"
                  value={formData.subKategori}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Pilih Sub Kategori</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Meja">Meja</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="font-medium">Lokasi Aset</label>
                <input
                  type="text"
                  name="lokasiAset"
                  placeholder="Masukkan lokasi aset"
                  value={formData.lokasiAset}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Penanggung Jawab</label>
                <input
                  type="text"
                  name="penanggungJawab"
                  placeholder="Masukkan penanggung jawab"
                  value={formData.penanggungJawab}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="font-medium">Kode BMD</label>
                <input
                  type="text"
                  name="kodeBMD"
                  placeholder="Masukkan kode BMD"
                  value={formData.kodeBMD}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-6">
                <label className="font-medium">Unggah Dokumen</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
                  <input
                    type="file"
                    onChange={handleFile}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    📤 Unggah Dokumen
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    File dengan ukuran kurang dari 1 MB
                  </p>
                  {formData.dokumen && (
                    <p className="text-sm text-green-600 mt-1">
                      File diunggah: {formData.dokumen.name}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Konfirmasi Data Aset
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="font-medium">Nama Aset</label>
                  <input
                    type="text"
                    value={formData.namaAset}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Merk/Tipe Aset</label>
                  <input
                    type="text"
                    value={formData.merkTipe}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Tanggal Perolehan</label>
                  <input
                    type="date"
                    value={formData.tanggalPerolehan}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Kondisi Aset</label>
                  <input
                    type="text"
                    value={formData.kondisi.join(", ")}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Biaya Aset</label>
                  <input
                    type="text"
                    value={`Rp ${formData.nilaiAset || "0"}`}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Nama Dinas</label>
                  <input
                    type="text"
                    value={formData.namaDinas}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Kategori Aset</label>
                  <input
                    type="text"
                    value={formData.kategoriAset}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Sub Kategori</label>
                  <input
                    type="text"
                    value={formData.subKategori}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Lokasi Aset</label>
                  <input
                    type="text"
                    value={formData.lokasiAset}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={formData.penanggungJawab}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Kode BMD</label>
                  <input
                    type="text"
                    value={formData.kodeBMD}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-medium">Dokumen</label>
                  <input
                    type="text"
                    value={
                      formData.dokumen
                        ? formData.dokumen.name
                        : "Tidak ada file diunggah"
                    }
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </>
          )}

          {/* Tombol Navigasi */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
              >
                Kembali
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => alert("Data berhasil disimpan!")}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium ml-auto"
              >
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </LayoutDinas>
  );
}
