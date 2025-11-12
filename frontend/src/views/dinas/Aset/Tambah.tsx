import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import Step1 from "../../../components/asset/dinas/form/Step1";
import StepTI, { type FormDataTI } from "../../../components/asset/dinas/form/TI";
import StepNonTI, { type FormDataNonTI } from "../../../components/asset/dinas/form/Non-TI";

export default function Tambah() {
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // --- Data Step 1 ---
  const [formData, setFormData] = useState({
    namaAset: "",
    merkTipe: "",
    kodeBMD: "",
    tanggalPerolehan: "",
    indukAset: "",
    lokasiAset: "",
    penanggungJawab: "",
    kategoriAset: "",
    subKategori: "",
  });

  // --- Data Step TI ---
  const [formDataTI, setFormDataTI] = useState<FormDataTI>({
    ipAddress: "",
    os: "",
    version: "",
    cpu: "",
    ram: "",
    storage: "",
    tanggalDeployment: "",
    vendor: "",
    url: "",
    serialNumber: "",
  });

  // --- Data Step Non-TI ---
  const [formDataNonTI, setFormDataNonTI] = useState<FormDataNonTI>({
    material: "",
    ukuran: "",
    tanggalPerolehan: "",
    nilaiAset: "",
    kondisi: [],
    vendor: "",
    lokasiPenyimpanan: "",
    masaPakai: "",
  });

  // === Gambar step dinamis ===
  const [stepImage, setStepImage] = useState("/wizard/step1.png");

  const updateStepImage = (currentStep: number, kategori: string) => {
    if (currentStep === 1) setStepImage("/wizard/step1.png");
    else if (currentStep === 2 && kategori.toLowerCase() === "ti") setStepImage("/wizard/stepTI.png");
    else if (currentStep === 2 && kategori.toLowerCase() === "non-ti") setStepImage("/wizard/stepNon-TI.png");
    else if (currentStep === 3)
      setStepImage(
        kategori.toLowerCase() === "ti"
          ? "/wizard/stepTIkonfir.png"
          : "/wizard/stepNon-TIkonfir.png"
      );
  };

  useEffect(() => {
    updateStepImage(step, formData.kategoriAset);
  }, [step, formData.kategoriAset]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isTI = formData.kategoriAset.toLowerCase() === "ti";

  const handleShowPopup = () => {
    setShowPopup(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClosePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="relative p-6 space-y-8">
      {/* STEP INDICATOR */}
      <div className="flex justify-center mb-6">
        <img
          src={stepImage}
          alt={`Step ${step}`}
          className="w-[900px] h-[50px] object-contain transition-all duration-300"
        />
      </div>

      {/* FORM WIZARD */}
      <div>
        {step === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            nextStep={() => {
              if (formData.kategoriAset) nextStep();
            }}
          />
        )}

        {step === 2 && isTI && (
          <StepTI
            formData={formDataTI}
            setFormData={setFormDataTI}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 2 && !isTI && (
          <StepNonTI
            formData={formDataNonTI}
            setFormData={setFormDataNonTI}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold mb-4">Step 3 - Konfirmasi Data</h2>

            {/* Step 1 Data */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Informasi Umum Aset</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 text-sm">{key}</span>
                    <input
                      type="text"
                      value={value}
                      disabled
                      className="border border-gray-300 rounded px-2 py-1 bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Step TI / Non-TI */}
            <div className="flex gap-6">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Form TI</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(formDataTI).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-500 text-sm">{key}</span>
                      <input
                        type="text"
                        value={value}
                        disabled={!isTI}
                        className={`border rounded px-2 py-1 ${
                          isTI
                            ? "border-gray-300 bg-gray-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-2">Form Non-TI</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(formDataNonTI).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-500 text-sm">{key}</span>
                      {Array.isArray(value) ? (
                        <input
                          type="text"
                          value={value.join(", ")}
                          disabled={isTI}
                          className={`border rounded px-2 py-1 ${
                            !isTI
                              ? "border-gray-300 bg-gray-100"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={value as string}
                          disabled={isTI}
                          className={`border rounded px-2 py-1 ${
                            !isTI
                              ? "border-gray-300 bg-gray-100"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Kembali
              </button>
              <button
                onClick={handleShowPopup}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* === POPUP === */}
      {showPopup && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClosePopup}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative z-10 transform transition-all duration-300 ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon Success */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-blue-600" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Aset Berhasil Ditambahkan!
            </h2>

            <p className="text-sm text-gray-500 text-center mb-8">
              AST-11-2025 • Asus Vivobook
            </p>

            {/* Tombol */}
            <button className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700">
              Lihat Detail Aset
            </button>

            <button className="w-full text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-50 mt-3">
              Tambah Aset Lain
            </button>

            <button className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 mt-2">
              Kembali ke Dashboard Aset
            </button>

            <button className="w-full bg-blue-50 text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-100 mt-6">
              Tambah Risiko
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
