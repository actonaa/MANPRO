import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Step1, {
  type AsetFormData,
} from "../../../components/asset/dinas/form/Step1";
import StepTI, {
  type FormDataTI,
} from "../../../components/asset/dinas/form/TI";
import StepNonTI, {
  type FormDataNonTI,
} from "../../../components/asset/dinas/form/Non-TI";

export default function Tambah() {
  const navigate = useNavigate();

  const [savedAsset, setSavedAsset] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);

  const LABELS_STEP1: Record<string, string> = {
    namaAset: "Nama Aset",
    merkTipe: "Merk / Tipe",
    kodeBMD: "Kode BMD",
    tanggalPerolehan: "Tanggal Perolehan",
    indukAset: "Induk Aset",
    lokasiAset: "Lokasi Aset",
    penanggungJawab: "Penanggung Jawab",
    kategoriAset: "Kategori Aset",
    subKategori: "Sub Kategori",
    kondisi: "Kondisi",
    useful_life: "Masa Pakai",
    nilaiAset: "Nilai Aset",
    vendor: "Vendor",
  };

  const LABELS_TI: Record<keyof FormDataTI, string> = {
    ipAddress: "IP Address",
    os: "Sistem Operasi",
    version: "Versi",
    tanggalDeployment: "Tanggal Deployment",
    url: "URL",
    serialNumber: "Serial Number",
    hostname: "Hostname",
  };

  const LABEL_NON_TI: Record<string, string> = {
    material: "Material",
    ukuran: "Ukuran",
  };

  // --- Data Step 1 ---
  const [formData, setFormData] = useState<AsetFormData>({
    namaAset: "",
    merkTipe: "",
    kodeBMD: "",
    tanggalPerolehan: "",
    indukAset: "",
    lokasiAset: "",
    penanggungJawab: "",
    kategoriAset: "",
    subKategori: "",
    kondisi: "",
    useful_life: "",
    nilaiAset: "",
    vendor: "",
    kategoriAsetNama: "",
  });

  // --- Data Step TI ---
  const [formDataTI, setFormDataTI] = useState<FormDataTI>({
    ipAddress: "",
    hostname: "",
    os: "",
    version: "",
    tanggalDeployment: "",
    url: "",
    serialNumber: "",
  });

  // --- Data Step Non-TI ---
  const [formDataNonTI, setFormDataNonTI] = useState<FormDataNonTI>({
    material: "",
    ukuran: "",
  });

  // === SUBMIT DATA ===
  const submitData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token tidak ditemukan. Pastikan Anda sudah login.");
      return;
    }

    setIsLoading(true);

    try {
      const formDataSend = new FormData();

      // === FIELD STEP 1 ===
      formDataSend.append("name", formData.namaAset);
      formDataSend.append("merk_type", formData.merkTipe);
      formDataSend.append("bmd_code", formData.kodeBMD);
      formDataSend.append("acquisition_date", formData.tanggalPerolehan || "");
      formDataSend.append("parent_id", formData.indukAset || "");
      formDataSend.append("lokasi", formData.lokasiAset);
      formDataSend.append("pic", formData.penanggungJawab);
      formDataSend.append("category_id", formData.kategoriAset);
      formDataSend.append("sub_category_id", formData.subKategori);
      formDataSend.append("condition_id", formData.kondisi || "");
      formDataSend.append("acquisition_value", String(formData.nilaiAset));
      formDataSend.append("vendor", formData.vendor);
      formDataSend.append("useful_life", formData.useful_life);

      // === FILE (TANPA BASE64) ===
      if (uploadedFiles && uploadedFiles.length > 0) {
        formDataSend.append("file", uploadedFiles[0]);
      }

      // === DATA TI / NON TI ===
      if (isTI) {
        formDataSend.append("ip_address", formDataTI.ipAddress);
        formDataSend.append("os", formDataTI.os);
        formDataSend.append("version", formDataTI.version);
        formDataSend.append("deploy_date", formDataTI.tanggalDeployment || "");
        formDataSend.append("serial_number", formDataTI.serialNumber);
        formDataSend.append("hostname", formDataTI.hostname);
        formDataSend.append("url", formDataTI.url);
      } else {
        formDataSend.append("material", formDataNonTI.material);
        formDataSend.append("specification", formDataNonTI.ukuran);
      }

      // === KIRIM KE BACKEND ===
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataSend,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        alert("Gagal menyimpan aset: " + result?.message);
        return;
      }

      setSavedAsset({
        id: result.id,
        name: result.name,
      });

      handleShowPopup();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsLoading(false);
    }
  };

  // === Gambar step dinamis ===
  const [stepImage, setStepImage] = useState("/wizard/step1.png");

  const updateStepImage = (currentStep: number, kategori: string) => {
    if (currentStep === 1) setStepImage("/wizard/step1.png");
    else if (currentStep === 2 && kategori.toLowerCase() === "ti")
      setStepImage("/wizard/stepTI.png");
    else if (currentStep === 2 && kategori.toLowerCase() === "non-ti")
      setStepImage("/wizard/stepNon-TI.png");
    else if (currentStep === 3)
      setStepImage(
        kategori.toLowerCase() === "ti"
          ? "/wizard/stepTIkonfir.png"
          : "/wizard/stepNon-TIkonfir.png"
      );
  };

  useEffect(() => {
    updateStepImage(step, formData.kategoriAsetNama);
  }, [step, formData.kategoriAset, formData.kategoriAsetNama]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isTI = formData.kategoriAsetNama === "ti";

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
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
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
            <h2 className="text-xl font-semibold mb-4">
              Step 3 - Konfirmasi Data
            </h2>

            {/* Step 1 Data */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Informasi Umum Aset</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 text-sm">
                      {LABELS_STEP1[key] || key}
                    </span>

                    <input
                      type="text"
                      value={
                        Array.isArray(value)
                          ? value.join(", ")
                          : (value as string)
                      }
                      disabled
                      className="
                border border-gray-300 rounded px-2 py-1 
                bg-gray-100 
                cursor-not-allowed 
                select-none 
                pointer-events-none
              "
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Step TI / Non-TI */}
            <div className="flex gap-6">
              {/* TI */}
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Form TI</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(formDataTI).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-500 text-sm">
                        {LABELS_TI[key as keyof FormDataTI] || key}
                      </span>

                      <input
                        type="text"
                        value={value}
                        disabled={!isTI}
                        className={`border rounded px-2 py-1 cursor-not-allowed select-none pointer-events-none ${
                          isTI
                            ? "border-gray-300 bg-gray-100"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* NON TI */}
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Form Non-TI</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(formDataNonTI).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-500 text-sm">
                        {LABEL_NON_TI[key] || key}
                      </span>

                      <input
                        type="text"
                        value={
                          Array.isArray(value)
                            ? value.join(", ")
                            : (value as string)
                        }
                        disabled={isTI}
                        className={`border rounded px-2 py-1 cursor-not-allowed select-none pointer-events-none ${
                          !isTI
                            ? "border-gray-300 bg-gray-100"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Sebelumnya
              </button>
              <button
                onClick={submitData}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg text-white ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Loading..." : "Simpan"}
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
            {/* Icon Success */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 rounded-full p-4">
                <CheckCircle
                  className="w-12 h-12 text-blue-600"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Aset Berhasil Ditambahkan!
            </h2>

            <p className="text-sm text-gray-500 text-center mb-8">
              {savedAsset?.id || "-"} • {savedAsset?.name || "-"}
            </p>

            {/* Tombol */}
            <button
              onClick={() => navigate(`/aset/${savedAsset?.id}`)}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700"
            >
              Lihat Detail Aset
            </button>

            <button
              onClick={() => navigate("/aset/tambah")}
              className="w-full text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-50 mt-3"
            >
              Tambah Aset Lain
            </button>

            <button
              onClick={() => navigate("/aset")}
              className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 mt-2"
            >
              Kembali ke Dashboard Aset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
