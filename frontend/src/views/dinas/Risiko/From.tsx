/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ChangeEvent } from "react";
import { CheckCircle, X } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Import gambar wizard untuk desktop dan mobile
import Step1Desktop from "/wizard/risiko1.png";
import Step2Desktop from "/wizard/risiko2.png";
import Step3Desktop from "/wizard/risiko3.png";
import Step4Desktop from "/wizard/risiko4.png";

import Step1Mobile from "/wizard/risikohp1.png";
import Step2Mobile from "/wizard/risikohp2.png";
import Step3Mobile from "/wizard/risikohp3.png";
import Step4Mobile from "/wizard/risikohp4.png";
import Step1 from "../../../components/asset/dinas/risiko/Step1";
import Step2 from "../../../components/asset/dinas/risiko/Step2";
import Step3 from "../../../components/asset/dinas/risiko/Step3";
import Step4 from "../../../components/asset/dinas/risiko/Step4";

interface FormData {
  // Step 1
  tipe?: string;
  namaRisiko: string;
  deskripsiRisiko: string;
  penyebabRisiko: string[];
  dampakRisiko: string[];
  kategoriRisiko?: string;
  areaDampak?: string;

  // Step 2
  probabilitas: string;
  dampak: string;
  kriteriaDampak: string;
  jenisRisiko?: string;
  prioritasRisiko: string;
  levelAwal: string;

  // Step 3
  strategi: string;
  aksiMitigasi: string;
  pemilik: string;
  targetWaktu: string;
  perkiraanBiaya: string;
  efektivitas: string;
  levelResidual: string;
  probabilitasResidual: string;
  dampakResidual: string;
}

// Komponen Success Popup dengan Animasi
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
      <div className="absolute inset-0 bg-black/50 "></div>

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
  const { asset_id } = useParams<{ asset_id: string }>();
  const [step, setStep] = useState<number>(1);
  const [impactAreas, setImpactAreas] = useState<
    { id: string; name: string }[]
  >([]);
  const [riskCategories, setRiskCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipe: "Aset",
    namaRisiko: "",
    deskripsiRisiko: "",
    penyebabRisiko: [""],
    dampakRisiko: [""],
    kategoriRisiko: "",
    areaDampak: "",
    probabilitas: "",
    dampak: "",
    kriteriaDampak: "",
    jenisRisiko: "",
    prioritasRisiko: "",
    levelAwal: "",
    strategi: "",
    aksiMitigasi: "",
    pemilik: "",
    targetWaktu: "",
    perkiraanBiaya: "",
    efektivitas: "",
    levelResidual: "",
    probabilitasResidual: "",
    dampakResidual: "",
  });

  // Ambil data impact-area dan risk-categories
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [impactRes, categoryRes] = await Promise.all([
          axios.get("https://asset-risk-management.vercel.app/api/impact-area"),
          axios.get(
            "https://asset-risk-management.vercel.app/api/risk-categories"
          ),
        ]);
        setImpactAreas(Array.isArray(impactRes.data) ? impactRes.data : []);
        setRiskCategories(
          Array.isArray(categoryRes.data) ? categoryRes.data : []
        );
      } catch (err) {
        console.error("Gagal fetch dropdown:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Breakpoint 768px untuk mobile
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const stepImages = {
    desktop: [Step1Desktop, Step2Desktop, Step3Desktop, Step4Desktop],
    mobile: [Step1Mobile, Step2Mobile, Step3Mobile, Step4Mobile],
  };
  useEffect(() => {
    const p = Number(formData.probabilitas);
    const d = Number(formData.dampak);

    if (!p || !d) return;

    const hasil = p * d;

    setFormData((prev: any) => ({
      ...prev,
      levelAwal: hasil,
      jenisRisiko: hasil <= 14 ? "Negatif" : "Positif",
      kriteriaDampak: hasil <= 6 ? "Low" : hasil <= 14 ? "Medium" : "High",
    }));
  }, [formData.probabilitas, formData.dampak]);

  // Handle perubahan input teks
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    type: "penyebab" | "dampak",
    index: number,
    value: string
  ) => {
    const key = type === "penyebab" ? "penyebabRisiko" : "dampakRisiko";
    const updated = [...(formData as any)[key]];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  const handleAddField = (type: "penyebab" | "dampak") => {
    const key = type === "penyebab" ? "penyebabRisiko" : "dampakRisiko";
    const updated = [...(formData as any)[key], ""];
    setFormData((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  const handleRemoveField = (field: "penyebab" | "dampak", index: number) => {
    setFormData((prevData) => {
      const key = field === "penyebab" ? "penyebabRisiko" : "dampakRisiko";
      const updatedArray = [...(prevData as any)[key]];

      // Cegah hapus kalau cuma tersisa satu
      if (updatedArray.length === 1) return prevData;

      updatedArray.splice(index, 1);

      return {
        ...prevData,
        [key]: updatedArray,
      };
    });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Generate kode risiko (contoh: RISK-11-2025)
  const generateRiskCode = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    return `RISK-${month}-${year}`;
  };

  // Fungsi submit POST ke API
  const handleSubmit = async () => {
    try {
      if (!asset_id) {
        alert("Asset ID tidak ditemukan!");
        return;
      }

      setLoading(true);

      const foundCategory = riskCategories.find(
        (k) =>
          k.name?.toLowerCase() ===
          (formData.kategoriRisiko || "").toLowerCase()
      );
      const foundImpact = impactAreas.find(
        (a) =>
          a.name?.toLowerCase() === (formData.areaDampak || "").toLowerCase()
      );

      // CEK APAKAH STEP 3 ADA ISINYA → treatment mode
      const hasTreatment =
        formData.aksiMitigasi?.trim() !== "" ||
        formData.pemilik?.trim() !== "" ||
        formData.strategi?.trim() !== "";

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan!");

      if (!hasTreatment) {
        // ============================================
        //   MODE 1 → INSERT RISK TANPA TREATMENT
        // ============================================
        const payloadRiskOnly = {
          asset_id,
          type: formData.tipe || "Aset",
          title: formData.namaRisiko,
          description: formData.deskripsiRisiko,
          cause: formData.penyebabRisiko.join(", "),
          impact: formData.dampakRisiko.join(", "),
          scenario_id: null,
          probability: Number(formData.probabilitas),
          impact_score: Number(formData.dampak),
          criteria: formData.kriteriaDampak,
          entry_level: Number(formData.levelAwal),
          priority: formData.prioritasRisiko,
          type_of_risk: formData.jenisRisiko,
          risk_category_id: foundCategory?.id || null,
          impact_area_id: foundImpact?.id || null,
        };

        await axios.post(
          "https://asset-risk-management.vercel.app/api/risks",
          payloadRiskOnly,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("INSERT Risk Only (tanpa treatment)");
      } else {
        // ============================================
        //   MODE 2 → INSERT RISK + TREATMENT
        // ============================================
        const payloadWithTreatment = {
          risk: {
            asset_id,
            type: formData.tipe,
            title: formData.namaRisiko,
            description: formData.deskripsiRisiko,
            cause: formData.penyebabRisiko.join(", "),
            impact: formData.dampakRisiko.join(", "),
            probability: Number(formData.probabilitas),
            impact_score: Number(formData.dampak),
            criteria: formData.kriteriaDampak,
            priority: formData.prioritasRisiko,
            risk_category_id: foundCategory?.id || null,
            impact_area_id: foundImpact?.id || null,
          },
          treatments: [
            {
              strategy: formData.strategi,
              action: formData.aksiMitigasi,
              action_owner: formData.pemilik,
              target_date: new Date(formData.targetWaktu)
                .toISOString()
                .split("T")[0],
              cost: Number(formData.perkiraanBiaya),
              effectiveness: formData.efektivitas,
              new_probability: Number(formData.probabilitasResidual),
              new_impact_score: Number(formData.dampakResidual),
            },
          ],
        };

        await axios.post(
          "https://asset-risk-management.vercel.app/api/risks/with-treatments",
          payloadWithTreatment,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("INSERT Risk + Treatment");
      }

      setShowPopup(true);
    } catch (err: any) {
      console.error(err);
      alert("Gagal submit risiko: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Option: reset form / redirect ke halaman lain
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col p-5 rounded-2xl">
        {/* Header Wizard */}
        <div className="flex flex-col w-full mx-auto">
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

          <div className="bg-white rounded-2xl p-6 w-full">
            {step === 1 && (
              <Step1
                formData={formData}
                handleChange={handleChange}
                handleArrayChange={handleArrayChange}
                handleAddField={handleAddField}
                handleRemoveField={handleRemoveField}
              />
            )}
            {step === 2 && (
              <Step2 formData={formData} handleChange={handleChange} />
            )}
            {step === 3 && (
              <Step3 formData={formData} handleChange={handleChange} />
            )}

            {step === 4 && <Step4 formData={formData} />}

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
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium ml-auto ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Menyimpan..." : "Selesai"}
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
    </>
  );
}
