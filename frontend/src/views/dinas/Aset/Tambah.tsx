import { useState, useEffect, type ChangeEvent } from "react";
import { CheckCircle, X } from "lucide-react";
import LayoutDinas from "../../layout/LayoutDinas";

// Import gambar wizard untuk desktop dan mobile
import Step1Desktop from "/wizard/step1.png";
import Step2Desktop from "/wizard/step2.png";
import Step3Desktop from "/wizard/step3.png";

import Step1Mobile from "/wizard/Container1.png";
import Step2Mobile from "/wizard/Container2.png";
import Step3Mobile from "/wizard/Container3.png";

interface FormData {
  // Step 1
  namaAset: string;
  merkTipe: string;
  serialNumber: string;
  version: string;
  os: string;
  ipAddress: string;
  hostname: string;
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

// Komponen Success Popup dengan Animasi (tidak diubah)
function SuccessPopup({
  onClose,
  assetInfo,
}: {
  onClose: () => void;
  assetInfo: { code: string; name: string };
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* Popup Modal */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative z-10 transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon Success dengan animasi */}
        <div className="flex justify-center mb-6">
          <div
            className={`bg-blue-50 rounded-full p-4 transform transition-all duration-500 ${
              isClosing ? "scale-0" : "scale-100"
            }`}
          >
            <CheckCircle className="w-12 h-12 text-blue-600" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2
          className={`text-xl font-semibold text-gray-900 text-center mb-2 transition-all duration-300 delay-100 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Aset Berhasil Ditambahkan!
        </h2>

        {/* Subtitle */}
        <p
          className={`text-sm text-gray-500 text-center mb-8 transition-all duration-300 delay-150 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {assetInfo.code} • {assetInfo.name}
        </p>

        {/* Primary Button */}
        <button
          onClick={handleClose}
          className={`w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 delay-200 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Lihat Detail Aset
        </button>

        {/* Secondary Button */}
        <button
          onClick={handleClose}
          className={`w-full text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 delay-250 mt-3 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Tambah Aset Lain
        </button>

        {/* Tertiary Link */}
        <button
          onClick={handleClose}
          className={`w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-all duration-300 delay-350 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Kembali ke Dashboard Aset
        </button>

        {/* Bottom Button */}
        <button
          onClick={handleClose}
          className={`w-full bg-blue-50 text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-100 transition-all duration-300 delay-400 mt-6 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Tambah Risko
        </button>
      </div>
    </div>
  );
}

export default function AssetWizard() {
  const [step, setStep] = useState<number>(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    namaAset: "",
    merkTipe: "",
    serialNumber: "",
    version: "",
    os: "",
    ipAddress: "",
    hostname: "",
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

  // Gunakan useEffect untuk mendeteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Array gambar untuk desktop dan mobile
  const stepImages = {
    desktop: [Step1Desktop, Step2Desktop, Step3Desktop],
    mobile: [Step1Mobile, Step2Mobile, Step3Mobile],
  };

  // Tambahkan useEffect untuk scroll ke atas saat step berubah
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

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

  // Handle submit
  const handleSubmit = () => {
    // Simulasi save data
    setShowPopup(true);
  };

  // Handle close popup
  const handleClosePopup = () => {
    setShowPopup(false);
    // Reset form atau redirect sesuai kebutuhan
  };

  // Generate kode aset (contoh: AST-11-2025)
  const generateAssetCode = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    return `AST-${month}-${year}`;
  };

  return (
    <LayoutDinas>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Wizard */}
        <div className="flex flex-col w-full mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Tambah Aset</h1>
          <div className="flex items-center justify-center">
            <img
              src={
                isMobile
                  ? stepImages.mobile[step - 1]
                  : stepImages.desktop[step - 1]
              }
              alt={`Step ${step}`}
              className="w-full max-w-2xl mb-6 object-contain"
            />
          </div>

          {/* Form Container */}
          <div className="bg-white shadow-md rounded-2xl p-6 w-full">
            {step === 1 && (
              <>
                <div className="space-y-4">
                  {/* Nama Aset */}
                  <div>
                    <label className="font-medium">Nama Aset</label>
                    <input
                      type="text"
                      name="namaAset"
                      placeholder="Masukkan Nama Aset"
                      value={formData.namaAset}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Merk/Tipe Aset */}
                  <div>
                    <label className="font-medium">Merk/Tipe Aset</label>
                    <input
                      type="text"
                      name="merkTipe"
                      placeholder="Masukkan Merk / Tipe Aset"
                      value={formData.merkTipe}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Serial Number Aset */}
                  <div>
                    <label className="font-medium">Serial Number Aset</label>
                    <input
                      type="text"
                      name="serialNumber"
                      placeholder="Masukkan Nomor Serial Aset"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Version */}
                  <div>
                    <label className="font-medium">Version</label>
                    <input
                      type="text"
                      name="version"
                      placeholder="Masukkan versi aset"
                      value={formData.version}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* OS */}
                  <div>
                    <label className="font-medium">OS</label>
                    <input
                      type="text"
                      name="os"
                      placeholder="Masukkan OS"
                      value={formData.os}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* IP Address */}
                  <div>
                    <label className="font-medium">IP Address</label>
                    <input
                      type="text"
                      name="ipAddress"
                      placeholder="Masukkan IP Address"
                      value={formData.ipAddress}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Hostname */}
                  <div>
                    <label className="font-medium">Hostname</label>
                    <input
                      type="text"
                      name="hostname"
                      placeholder="Masukkan Hostname"
                      value={formData.hostname}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Tanggal Perolehan Aset */}
                  <div>
                    <label className="font-medium">
                      Tanggal Perolehan Aset
                    </label>
                    <input
                      type="date"
                      name="tanggalPerolehan"
                      value={formData.tanggalPerolehan}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Kondisi Aset */}
                  <div>
                    <label className="font-medium">Kondisi Aset</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {/* Kolom 1: Baik / Rusak */}
                      <div className="border border-gray-300 rounded-lg px-3 py-2 w-full">
                        <div className="flex flex-col gap-2">
                          {["Baik", "Rusak"].map((kondisi) => {
                            const isBaik = formData.kondisi.includes("Baik");
                            const isRusak =
                              formData.kondisi.includes("Rusak") ||
                              formData.kondisi.includes("Ringan") ||
                              formData.kondisi.includes("Berat");
                            return (
                              <label
                                key={kondisi}
                                className="flex items-center text-base"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.kondisi.includes(kondisi)}
                                  onChange={() => handleCheckbox(kondisi)}
                                  disabled={
                                    (isBaik && kondisi !== "Baik") ||
                                    (isRusak && kondisi === "Baik")
                                  }
                                  className="mr-3 w-5 h-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {kondisi}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Kolom 2: Ringan / Berat */}
                      <div className="border border-gray-300 rounded-lg px-3 py-2 w-full">
                        <div className="flex flex-col gap-2">
                          {["Ringan", "Berat"].map((kondisi) => {
                            const isBaik = formData.kondisi.includes("Baik");
                            return (
                              <label
                                key={kondisi}
                                className="flex items-center text-base"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.kondisi.includes(kondisi)}
                                  onChange={() => handleCheckbox(kondisi)}
                                  disabled={isBaik}
                                  className="mr-3 w-5 h-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {kondisi}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nilai Aset */}
                  <div>
                    <label className="font-medium">Nilai Aset</label>
                    <input
                      type="number"
                      name="nilaiAset"
                      placeholder="Rp 0"
                      value={formData.nilaiAset}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-medium">Kategori Aset</label>
                  <select
                    name="kategoriAset"
                    value={formData.kategoriAset}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                    <label className="font-medium">Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-medium">OS</label>
                    <input
                      type="text"
                      value={formData.os}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-medium">IP Address</label>
                    <input
                      type="text"
                      value={formData.ipAddress}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-medium">Hostname</label>
                    <input
                      type="text"
                      value={formData.hostname}
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
                    <label className="font-medium">Nilai Aset</label>
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
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium ml-auto"
                >
                  Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup dengan Animasi */}
      {showPopup && (
        <SuccessPopup
          onClose={handleClosePopup}
          assetInfo={{
            code: generateAssetCode(),
            name: formData.namaAset || "Nama Aset",
          }}
        />
      )}
    </LayoutDinas>
  );
}
