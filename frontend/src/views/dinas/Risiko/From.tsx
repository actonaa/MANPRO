import { useState, useEffect, type ChangeEvent } from "react";
import { CheckCircle, X } from "lucide-react";
import LayoutDinas from "../../layout/LayoutDinas";

// Import gambar wizard untuk desktop dan mobile
import Step1Desktop from "/wizard/risiko1.png";
import Step2Desktop from "/wizard/risiko2.png";
import Step3Desktop from "/wizard/risiko3.png";
import Step4Desktop from "/wizard/risiko4.png";

import Step1Mobile from "/wizard/risikohp1.png";
import Step2Mobile from "/wizard/risikohp2.png";
import Step3Mobile from "/wizard/risikohp3.png";
import Step4Mobile from "/wizard/risikohp4.png";

interface FormData {
  // Step 1
  namaRisiko: string;
  deskripsiRisiko: string;
  penyebabRisiko: string;
  dampakRisiko: string;
  statusRisiko: string; // Ditambahkan di step 1

  // Step 2
  probabilitas: string;
  dampak: string;
  kriteriaDampak: string;
  prioritasRisiko: string;
  levelAwal: string;

  // Step 3
  strategi: string;
  aksi1: string;
  aksi2: string;
  aksi3: string;
  pemilikRisiko: string;
  targetWaktu: string;
  perkiraanBiaya: string;
  efektivitas: string;
  levelResidual: string;
  probabilitasResidual: string; // Ditambahkan
  dampakResidual: string; // Ditambahkan


}

// Komponen Success Popup dengan Animasi (tidak diubah)
function SuccessPopup({
  onClose,
  riskInfo,
}: {
  onClose: () => void;
  riskInfo: { code: string; name: string };
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
          Risiko Berhasil Ditambahkan!
        </h2>

        {/* Subtitle */}
        <p
          className={`text-sm text-gray-500 text-center mb-8 transition-all duration-300 delay-150 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {riskInfo.code} • {riskInfo.name}
        </p>

        {/* Primary Button */}
        <button
          onClick={handleClose}
          className={`w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 delay-200 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Lihat Detail Risiko
        </button>

        {/* Secondary Button */}
        <button
          onClick={handleClose}
          className={`w-full text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 delay-250 mt-3 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Tambah Risiko Lain
        </button>

        {/* Tertiary Link */}
        <button
          onClick={handleClose}
          className={`w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-all duration-300 delay-350 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Kembali ke Dashboard Risiko
        </button>

        {/* Bottom Button */}
        <button
          onClick={handleClose}
          className={`w-full bg-blue-50 text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-100 transition-all duration-300 delay-400 mt-6 ${
            isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          Tambah Aset
        </button>
      </div>
    </div>
  );
}

export default function RisikoWizard() {
  const [step, setStep] = useState<number>(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false); // State untuk deteksi mobile
  const [formData, setFormData] = useState<FormData>({
    namaRisiko: "",
    deskripsiRisiko: "",
    penyebabRisiko: "",
    dampakRisiko: "",
    statusRisiko: "",
    probabilitas: "",
    dampak: "",
    kriteriaDampak: "",
    prioritasRisiko: "",
    levelAwal: "",
    strategi: "",
    aksi1: "",
    aksi2: "",
    aksi3: "",
    pemilikRisiko: "",
    targetWaktu: "",
    perkiraanBiaya: "",
    efektivitas: "",
    levelResidual: "",
    probabilitasResidual: "",
    dampakResidual: "",
  });

  // Gunakan useEffect untuk mendeteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Breakpoint 768px untuk mobile
    };
    checkMobile(); // Cek awal
    window.addEventListener("resize", checkMobile); // Cek saat resize
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Array gambar untuk desktop dan mobile
  const stepImages = {
    desktop: [Step1Desktop, Step2Desktop, Step3Desktop, Step4Desktop],
    mobile: [Step1Mobile, Step2Mobile, Step3Mobile, Step4Mobile],
  };

  // Tambahkan useEffect untuk scroll ke atas saat step berubah
  useEffect(() => {
    window.scrollTo(0, 0); // Gulir ke atas halaman
  }, [step]); // Jalankan setiap kali step berubah

  // Handle perubahan input teks
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Navigasi step
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
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

  // Generate kode risiko (contoh: RISK-11-2025)
  const generateRiskCode = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    return `RISK-${month}-${year}`;
  };

  return (
    <LayoutDinas>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Wizard */}
        <div className="flex flex-col w-full  mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Tambah Risiko</h1>
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
                <div className="mb-4">
                  <label className="font-medium">Nama Risiko</label>
                  <input
                    type="text"
                    name="namaRisiko"
                    placeholder="Masukkan Nama Risiko"
                    value={formData.namaRisiko}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-medium">Deskripsi Risiko</label>
                  <textarea
                    name="deskripsiRisiko"
                    placeholder="Masukkan Deskripsi Risiko"
                    value={formData.deskripsiRisiko}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <label className="font-medium">Penyebab Risiko</label>
                  <textarea
                    name="penyebabRisiko"
                    placeholder="Masukkan Penyebab Risiko"
                    value={formData.penyebabRisiko}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label className="font-medium">Dampak Risiko</label>
                  <textarea
                    name="dampakRisiko"
                    placeholder="Masukkan Dampak Risiko"
                    value={formData.dampakRisiko}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <label className="font-medium">Status Risiko</label>
                  <select
                    name="statusRisiko"
                    value={formData.statusRisiko}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Pilih Status Risiko</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-6">
                {/* ======= Kolom Kiri: Form ======= */}
                <div>
                  <h2 className="text-base font-semibold mb-6">
                    Langkah 2 — Analisis Risiko
                  </h2>

                  <div className="mb-4">
                    <label className="font-medium">Probabilitas</label>
                    <select
                      name="probabilitas"
                      value={formData.probabilitas}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    >
                      <option value="">Tentukan Level Probabilitas</option>
                      <option value="Hampir Pasti">Hampir Pasti</option>
                      <option value="Kemungkinan Besar">
                        Kemungkinan Besar
                      </option>
                      <option value="Kemungkinan Sedang">
                        Kemungkinan Sedang
                      </option>
                      <option value="Kemungkinan Kecil">
                        Kemungkinan Kecil
                      </option>
                      <option value="Jarang">Jarang</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="font-medium">Dampak</label>
                    <select
                      name="dampak"
                      value={formData.dampak}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    >
                      <option value="">Tentukan Level Dampak</option>
                      <option value="Sangat Rendah">Sangat Rendah</option>
                      <option value="Rendah">Rendah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sangat Tinggi">Sangat Tinggi</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="font-medium">Kriteria Dampak</label>
                    <textarea
                      name="kriteriaDampak"
                      placeholder="Cth: downtime > 2 jam, layanan publik terganggu, biaya > Rp 10 jt..."
                      value={formData.kriteriaDampak}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="font-medium">Prioritas Risiko</label>
                    <input
                      type="text"
                      name="prioritasRisiko"
                      placeholder="Rendah/Sedang/Tinggi"
                      value={formData.prioritasRisiko}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="font-medium">Level Awal</label>
                    <input
                      type="text"
                      name="levelAwal"
                      placeholder="Hasil P×D"
                      value={formData.levelAwal}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>

                {/* ======= Kolom Kanan: Heatmap ======= */}
                <div>
                  <div className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <img
                      src="/kelola-risiko/heatmap-risiko.png"
                      alt="Heatmap Risiko"
                      className="w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <h2 className="text-base font-semibold mb-6">
                  Langkah 3 — Mitigasi / Perlakuan Risiko
                </h2>

                {/* ======= Grid 2 Kolom ======= */}
                <div className="grid grid-cols-2 gap-6">
                  {/* === Kolom Kiri === */}
                  <div>
                    <div className="mb-4">
                      <label className="font-medium">Strategi</label>
                      <select
                        name="strategi"
                        value={formData.strategi}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      >
                        <option value="">Kurangi (Reduce)</option>
                        <option value="Hindari (Avoid)">Hindari (Avoid)</option>
                        <option value="Alihkan (Transfer)">
                          Alihkan (Transfer)
                        </option>
                        <option value="Terima (Accept)">Terima (Accept)</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">Aksi Mitigasi</label>
                      <div className="space-y-2 mt-1">
                        <input
                          type="text"
                          name="aksi1"
                          placeholder="Contoh: tambah PSU redundan, pasang alarm suhu, backup harian..."
                          value={formData.aksi1}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          name="aksi2"
                          placeholder="Opsional"
                          value={formData.aksi2}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-400 italic"
                        />
                        <input
                          type="text"
                          name="aksi3"
                          placeholder="Opsional"
                          value={formData.aksi3}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-400 italic"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">Pemilik Risiko</label>
                      <select
                        name="pemilikRisiko"
                        value={formData.pemilikRisiko}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      >
                        <option value="">Nama PIC</option>
                        <option value="IT">IT</option>
                        <option value="Keuangan">Keuangan</option>
                        <option value="Operasional">Operasional</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">Target Waktu</label>
                      <input
                        type="date"
                        name="targetWaktu"
                        value={formData.targetWaktu}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>

                  {/* === Kolom Kanan === */}
                  <div>
                    <div className="mb-4">
                      <label className="font-medium">Perkiraan Biaya</label>
                      <input
                        type="text"
                        name="perkiraanBiaya"
                        placeholder="Rp 5.000.000"
                        value={formData.perkiraanBiaya}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">
                        Probabilitas (Residual)
                      </label>
                      <select
                        name="probabilitasResidual"
                        value={formData.probabilitasResidual}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      >
                        <option value="">Tentukan Level Probabilitas</option>
                        <option value="Hampir Pasti">Hampir Pasti</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Rendah">Rendah</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">Dampak (Residual)</label>
                      <select
                        name="dampakResidual"
                        value={formData.dampakResidual}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      >
                        <option value="">Tentukan Level Dampak</option>
                        <option value="Sangat Rendah">Sangat Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Tinggi">Tinggi</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">Efektivitas</label>
                      <input
                        type="text"
                        name="efektivitas"
                        placeholder="Rendah/Sedang/Medium"
                        value={formData.efektivitas}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="font-medium">Level Residual</label>
                      <input
                        type="text"
                        name="levelResidual"
                        placeholder="Hasil P×D"
                        value={formData.levelResidual}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-base font-semibold mb-6">
                  Langkah 4 — Konfirmasi Data Risiko
                </h2>

                <div className="space-y-4">
                  {/* Nama Risiko */}
                  <div>
                    <label className="font-medium">Nama Risiko</label>
                    <input
                      type="text"
                      value={formData.namaRisiko}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Deskripsi Risiko */}
                  <div>
                    <label className="font-medium">Deskripsi Risiko</label>
                    <textarea
                      value={formData.deskripsiRisiko}
                      disabled
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Penyebab Risiko */}
                  <div>
                    <label className="font-medium">Penyebab Risiko</label>
                    <textarea
                      value={formData.penyebabRisiko}
                      disabled
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Dampak Risiko */}
                  <div>
                    <label className="font-medium">Dampak Risiko</label>
                    <textarea
                      value={formData.dampakRisiko}
                      disabled
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Status Risiko */}
                  <div>
                    <label className="font-medium">Status Risiko</label>
                    <input
                      type="text"
                      value={formData.statusRisiko}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Probabilitas */}
                  <div>
                    <label className="font-medium">Probabilitas</label>
                    <input
                      type="text"
                      value={formData.probabilitas}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Dampak */}
                  <div>
                    <label className="font-medium">Dampak</label>
                    <input
                      type="text"
                      value={formData.dampak}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Kriteria Dampak */}
                  <div>
                    <label className="font-medium">Kriteria Dampak</label>
                    <textarea
                      value={formData.kriteriaDampak}
                      disabled
                      rows={2}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Prioritas Risiko */}
                  <div>
                    <label className="font-medium">Prioritas Risiko</label>
                    <input
                      type="text"
                      value={formData.prioritasRisiko}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Level Awal */}
                  <div>
                    <label className="font-medium">Level Awal</label>
                    <input
                      type="text"
                      value={formData.levelAwal}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Strategi */}
                  <div>
                    <label className="font-medium">Strategi</label>
                    <input
                      type="text"
                      value={formData.strategi}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Target Waktu */}
                  <div>
                    <label className="font-medium">Target Waktu</label>
                    <input
                      type="text"
                      value={formData.targetWaktu}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Aksi Mitigasi */}
                  <div>
                    <label className="font-medium">Aksi Mitigasi</label>
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={formData.aksi1}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={formData.aksi2}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={formData.aksi3}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Perkiraan Biaya */}
                  <div>
                    <label className="font-medium">Perkiraan Biaya</label>
                    <input
                      type="text"
                      value={formData.perkiraanBiaya}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Pemilik Risiko */}
                  <div>
                    <label className="font-medium">Pemilik Risiko</label>
                    <input
                      type="text"
                      value={formData.pemilikRisiko}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Efektivitas */}
                  <div>
                    <label className="font-medium">Efektivitas</label>
                    <input
                      type="text"
                      value={formData.efektivitas}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Probabilitas (residual) */}
                  <div>
                    <label className="font-medium">
                      Probabilitas (Residual)
                    </label>
                    <input
                      type="text"
                      value={formData.probabilitasResidual}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Dampak (residual) */}
                  <div>
                    <label className="font-medium">Dampak (Residual)</label>
                    <input
                      type="text"
                      value={formData.dampakResidual}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Level Residual */}
                  <div>
                    <label className="font-medium">Level Residual</label>
                    <input
                      type="text"
                      value={formData.levelResidual}
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

              {step < 4 ? (
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

        {/* Success Popup dengan Animasi */}
        {showPopup && (
          <SuccessPopup
            onClose={handleClosePopup}
            riskInfo={{
              code: generateRiskCode(),
              name: formData.namaRisiko || "Nama Risiko",
            }}
          />
        )}
      </div>
    </LayoutDinas>
  );
}
