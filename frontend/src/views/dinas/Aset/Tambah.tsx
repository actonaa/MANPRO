import { useState } from "react";
import Step1 from "../../../components/asset/dinas/form/Step1";
import StepTI, { type FormDataTI } from "../../../components/asset/dinas/form/TI";
import StepNonTI, { type FormDataNonTI } from "../../../components/asset/dinas/form/Non-TI";

export default function Tambah() {
  const [step, setStep] = useState(1);

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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // === Fungsi Gambar Berdasarkan Step ===
  const getStepImage = () => {
    if (step === 1) return "/wizard/tambahaset1.png";
    if (step === 2 || step === 2.5) return "/wizard/tambahaset2.png";
    if (step === 3) return "/wizard/tambahaset3.png";
    return "";
  };

  return (
    <div className="p-6 space-y-8">
      {/* === STEP INDICATOR (GAMBAR PER STEP) === */}
      <div className="flex justify-center mb-6">
        <img
          src={getStepImage()}
          alt={`Step ${step}`}
          className="w-[400px] h-auto"
        />
      </div>

      {/* === KONTEN FORM WIZARD === */}
      <div>
        {/* Step 1 */}
        {step === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            nextStep={() => {
              if (formData.kategoriAset.toLowerCase() === "ti") {
                setStep(2);
              } else {
                setStep(2.5);
              }
            }}
          />
        )}

        {/* Step TI */}
        {step === 2 && (
          <StepTI
            formData={formDataTI}
            setFormData={setFormDataTI}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {/* Step Non-TI */}
        {step === 2.5 && (
          <StepNonTI
            formData={formDataNonTI}
            setFormData={setFormDataNonTI}
            nextStep={() => setStep(3)}
            prevStep={() => setStep(1)}
          />
        )}

        {/* Step Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3 - Review Data</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(
                {
                  ...formData,
                  ...(formData.kategoriAset.toLowerCase() === "ti"
                    ? formDataTI
                    : formDataNonTI),
                },
                null,
                2
              )}
            </pre>
            <button
              onClick={prevStep}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Kembali
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
