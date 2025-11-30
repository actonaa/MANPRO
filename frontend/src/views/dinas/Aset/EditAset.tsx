import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditAset() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [savedAsset, setSavedAsset] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);

  // Keep info about existing attachment (so we can show name / url)
  const [existingAttachmentName, setExistingAttachmentName] = useState<
    string | null
  >(null);
  const [existingAttachmentUrl, setExistingAttachmentUrl] = useState<
    string | null
  >(null);

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
    kondisi: "fb67aff5-8a84-4ffd-bdf6-a1f25d7b6270",
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

  // Step image
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

  const isTI = formData.kategoriAsetNama.toLowerCase() === "ti";

  // --- Fetch existing asset when mount (prefill) ---
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Pastikan Anda sudah login.");
      setIsFetching(false);
      return;
    }

    const fetchDetail = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/assets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          console.error("Fetch asset failed", err);
          alert("Gagal memuat data aset.");
          return;
        }

        const data = await res.json();

        // Map API response fields to form state
        setFormData((prev) => ({
          ...prev,
          namaAset: data.name ?? "",
          merkTipe: data.merk_type ?? "",
          kodeBMD: data.bmd_code ?? "",
          tanggalPerolehan: data.acquisition_date
            ? data.acquisition_date.split("T")[0]
            : data.acquisition_date ?? "",
          indukAset: data.parent_id ?? "",
          lokasiAset: data.lokasi ?? "",
          penanggungJawab: data.pic ?? "",
          kategoriAset: data.category_id ?? "",
          subKategori: data.sub_category_id ?? "",
          kondisi: data.condition_id ?? prev.kondisi,
          useful_life: data.useful_life ?? "",
          nilaiAset: data.acquisition_value
            ? String(data.acquisition_value)
            : "",
          vendor: data.vendor ?? "",
          kategoriAsetNama: (data.category?.name ?? "").toLowerCase() ?? "",
        }));

        // TI fields
        setFormDataTI({
          ipAddress: data.ip_address ?? "",
          hostname: data.hostname ?? "",
          os: data.os ?? "",
          version: data.version ?? "",
          tanggalDeployment: data.deploy_date
            ? data.deploy_date.split("T")[0]
            : data.deploy_date ?? "",
          url: data.url ?? "",
          serialNumber: data.serial_number ?? "",
        });

        // Non-TI fields
        setFormDataNonTI({
          material: data.material ?? "",
          ukuran: data.specification ?? "",
        });

        // attachments handling (may be null / object / array)
        // Try to set existing attachment name & url if available
        if (data.attachments) {
          // If attachments is array
          if (Array.isArray(data.attachments) && data.attachments.length > 0) {
            const att = data.attachments[0];
            setExistingAttachmentName(att.name ?? null);
            setExistingAttachmentUrl(att.url ?? null);
          } else if (
            typeof data.attachments === "object" &&
            data.attachments !== null
          ) {
            setExistingAttachmentName(data.attachments.name ?? null);
            setExistingAttachmentUrl(data.attachments.url ?? null);
          } else {
            // Fallback: maybe field image or image/url
            if (data.image) {
              setExistingAttachmentName("image");
              setExistingAttachmentUrl(data.image);
            }
          }
        } else if (data.image) {
          setExistingAttachmentName("image");
          setExistingAttachmentUrl(data.image);
        }

        // set savedAsset for popup
        setSavedAsset({
          id: data.id,
          name: data.name ?? "-",
        });
      } catch (err) {
        console.error("Error fetching asset:", err);
        alert("Terjadi kesalahan saat memuat data aset.");
      } finally {
        setIsFetching(false);
      }
    };

    void fetchDetail();
  }, [id]);

  // --- Handle file input change (attachment) ---
  const onFileChange = (files?: FileList | null) => {
    if (!files || files.length === 0) {
      setUploadedFiles(null);
      return;
    }
    // keep only first file (current behavior)
    const arr = Array.from(files).slice(0, 1);
    setUploadedFiles(arr);
    // If user upload new file, we can clear existingAttachmentName to show it's replaced
    setExistingAttachmentName(arr[0].name);
    setExistingAttachmentUrl(null);
  };

  // === SUBMIT DATA (PUT /api/assets/:id) ===
  const submitData = async () => {
    if (!id) {
      alert("ID aset tidak tersedia.");
      return;
    }

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
      if (formData.tanggalPerolehan)
        formDataSend.append("acquisition_date", formData.tanggalPerolehan);
      formDataSend.append("lokasi", formData.lokasiAset);
      formDataSend.append("pic", formData.penanggungJawab);
      formDataSend.append("category_id", formData.kategoriAset);
      formDataSend.append("sub_category_id", formData.subKategori);
      formDataSend.append("condition_id", formData.kondisi || "");
      formDataSend.append(
        "acquisition_value",
        String(formData.nilaiAset || "")
      );
      formDataSend.append("vendor", formData.vendor || "");
      if (formData.useful_life)
        formDataSend.append("useful_life", formData.useful_life);

      if (formData.indukAset && formData.indukAset.trim() !== "") {
        formDataSend.append("parent_id", formData.indukAset);
      } else {
        // If clearing parent explicitly is needed, backend may expect empty string or null.
        // formDataSend.append("parent_id", "");
      }

      // === FILE (attachment) ===
      // Based on info: API expects field name "attachment"
      if (uploadedFiles && uploadedFiles.length > 0) {
        formDataSend.append("file", uploadedFiles[0]);
      }
      // If no new file uploaded, we intentionally DON'T append anything so backend can keep existing attachment.

      // === DATA TI / NON-TI ===
      // === DATA TI / NON-TI ===
      if (isTI) {
        // Kirim hanya field TI
        if (formDataTI.ipAddress)
          formDataSend.append("ip_address", formDataTI.ipAddress);
        if (formDataTI.os) formDataSend.append("os", formDataTI.os);
        if (formDataTI.version)
          formDataSend.append("version", formDataTI.version);
        if (formDataTI.tanggalDeployment)
          formDataSend.append("deploy_date", formDataTI.tanggalDeployment);
        if (formDataTI.serialNumber)
          formDataSend.append("serial_number", formDataTI.serialNumber);
        if (formDataTI.hostname)
          formDataSend.append("hostname", formDataTI.hostname);
        if (formDataTI.url) formDataSend.append("url", formDataTI.url);
      } else {
        // Kirim hanya field Non-TI
        if (formDataNonTI.material)
          formDataSend.append("material", formDataNonTI.material);
        if (formDataNonTI.ukuran)
          formDataSend.append("specification", formDataNonTI.ukuran);
      }

      const response = await fetch(`/api/assets/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: do NOT set Content-Type when sending FormData; browser will set boundary.
        },
        body: formDataSend,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Update failed:", result);
        alert("Gagal memperbarui aset: " + (result?.message ?? "Server error"));
        return;
      }

      setSavedAsset({
        id: result.id ?? id,
        name: result.name ?? formData.namaAset,
      });

      // show popup success
      handleShowPopup();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPopup = () => {
    setShowPopup(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Simple loading skeleton while fetching
  if (isFetching) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

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
            setUploadedFiles={(f) =>
              onFileChange(f ? (f as unknown as FileList) : null)
            }
            uploadedFiles={uploadedFiles}
            // Also pass existing attachment info so Step1 can show existing file name/preview if needed
            // (Assuming Step1 accepts additional props — if not, remove them or extend Step1)
            existingAttachmentName={existingAttachmentName}
            // nextStep validation: only if category selected
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
                      className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed select-none pointer-events-none"
                    />
                  </div>
                ))}

                {/* show existing attachment info */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500 text-sm">Attachment</span>
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      {uploadedFiles && uploadedFiles.length > 0 ? (
                        <span>{uploadedFiles[0].name} (baru)</span>
                      ) : existingAttachmentName ? (
                        existingAttachmentUrl ? (
                          <a
                            href={existingAttachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            {existingAttachmentName}
                          </a>
                        ) : (
                          <span>{existingAttachmentName}</span>
                        )
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>

                    <label className="px-3 py-1 border rounded cursor-pointer text-sm bg-gray-50">
                      Ganti File
                      <input
                        type="file"
                        accept="*"
                        onChange={(e) => onFileChange(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
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
                {isLoading ? "Loading..." : "Simpan Perubahan"}
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
        >
          <div className="absolute inset-0 bg-black/20" />

          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative z-10 transform transition-all duration-300 ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 rounded-full p-4">
                <CheckCircle
                  className="w-12 h-12 text-blue-600"
                  strokeWidth={2}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Aset Berhasil Diperbarui!
            </h2>

            <p className="text-sm text-gray-500 text-center mb-8">
              {savedAsset?.id || "-"} • {savedAsset?.name || "-"}
            </p>

            <button
              onClick={() => navigate(`/aset/${savedAsset?.id}`)}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700"
            >
              Lihat Detail Aset
            </button>

            <button
              onClick={() => {
                navigate("/aset/tambah", { replace: true });
                window.location.reload();
              }}
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
