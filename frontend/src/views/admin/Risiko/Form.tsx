/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ChangeEvent } from "react";
import { CheckCircle, X } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // ⬅️ DITAMBAHKAN

// Import gambar wizard
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
  tipe?: string;
  namaRisiko: string;
  deskripsiRisiko: string;
  penyebabRisiko: string[];
  dampakRisiko: string[];
  kategoriRisiko?: string;
  areaDampak?: string;
  jenisRisiko?: string;

  probabilitas: string;
  dampak: string;
  kriteriaDampak: string;
  prioritasRisiko: string;
  levelAwal: string;

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

interface CreateRiskResponse {
  risk: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// ==========================
// POPUP
// ==========================
function SuccessPopup({
  onClose,
  onSeeDetail, // ⬅️ DITAMBAHKAN
  onAddAnother, // ⬅️ DITAMBAHKAN
  onDashboard, // ⬅️ DITAMBAHKAN
  riskInfo,
}: {
  onClose: () => void;
  onSeeDetail: () => void;
  onAddAnother: () => void;
  onDashboard: () => void;
  riskInfo: { code: string; name: string };
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative z-10 transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-blue-600" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          Risiko Berhasil Ditambahkan!
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {riskInfo.code} • {riskInfo.name}
        </p>

        {/* BUTTONS */}
        <button
          onClick={onSeeDetail} // ⬅️ DITAMBAHKAN
          className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700"
        >
          Lihat Detail Risiko
        </button>

        <button
          onClick={onAddAnother} // ⬅️ DITAMBAHKAN
          className="w-full text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-50 mt-3"
        >
          Tambah Risiko Lain
        </button>

        <button
          onClick={onDashboard} // ⬅️ DITAMBAHKAN
          className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 mt-2"
        >
          Kembali ke Dashboard Risiko
        </button>

        <button
          onClick={handleClose}
          className="w-full bg-blue-50 text-blue-600 py-3.5 rounded-lg font-medium hover:bg-blue-100 mt-6"
        >
          Tambah Aset
        </button>
      </div>
    </div>
  );
}

// ==========================
// MAIN COMPONENT
// ==========================
export default function RisikoWizard() {
  const { asset_id } = useParams<{ asset_id: string }>();
  const navigate = useNavigate(); // ⬅️ DITAMBAHKAN

  const [step, setStep] = useState(1);
  const [impactAreas, setImpactAreas] = useState<
    { id: string; name: string }[]
  >([]);
  const [riskCategories, setRiskCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const [showPopup, setShowPopup] = useState(false);
  const [newRiskId, setNewRiskId] = useState<string | null>(null); // ⬅️ DITAMBAHKAN

  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showErrors, setShowErrors] = useState(false);
  const [errors] = useState<Record<string, string>>({});

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

  // ==========================
  // FETCH DROPDOWNS
  // ==========================
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

  // ==========================
  // MOBILE DETECT
  // ==========================
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ==========================
  // AUTO SCROLL
  // ==========================
  useEffect(() => window.scrollTo(0, 0), [step]);

  const stepImages = {
    desktop: [Step1Desktop, Step2Desktop, Step3Desktop, Step4Desktop],
    mobile: [Step1Mobile, Step2Mobile, Step3Mobile, Step4Mobile],
  };

  // ==========================
  // AUTO HITUNG LEVEL
  // ==========================
  useEffect(() => {
    const p = Number(formData.probabilitas);
    const d = Number(formData.dampak);
    if (!p || !d) return;

    const hasil = p * d;
    setFormData((prev: any) => ({
      ...prev,
      levelAwal: hasil,
      kriteriaDampak: hasil <= 6 ? "Low" : hasil <= 14 ? "Medium" : "High",
    }));
  }, [formData.probabilitas, formData.dampak]);

  // ==========================
  // INPUT HANDLERS
  // ==========================
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
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleAddField = (type: "penyebab" | "dampak") => {
    const key = type === "penyebab" ? "penyebabRisiko" : "dampakRisiko";
    const updated = [...(formData as any)[key], ""];
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleRemoveField = (type: "penyebab" | "dampak", index: number) => {
    const key = type === "penyebab" ? "penyebabRisiko" : "dampakRisiko";
    const updated = [...(formData as any)[key]];
    if (updated.length === 1) return;
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const nextStep = () => {
    if (step === 1) {
      const isValid =
        formData.namaRisiko.trim() !== "" &&
        formData.deskripsiRisiko.trim() !== "" &&
        formData.penyebabRisiko.some((p) => p.trim() !== "");

      if (!isValid) {
        setShowErrors(true);
        return;
      }
    }

    if (step === 2) {
      const isValid =
        formData.probabilitas.trim() !== "" &&
        formData.dampak.trim() !== "" &&
        formData.prioritasRisiko.trim() !== "";

      if (!isValid) {
        setShowErrors(true);
        return;
      }
    }

    if (step === 3) {
      // 1️⃣ Harus pilih strategi dulu
      if (!formData.strategi || formData.strategi.trim() === "") {
        setShowErrors(true);
        return;
      }

      // 2️⃣ Kalau strategi PENERIMAAN RISIKO → langsung lolos
      if (formData.strategi === "Penerimaan Risiko") {
        setShowErrors(false);
        setStep((prev) => Math.min(prev + 1, 4));
        return;
      }

      // 3️⃣ Untuk strategi selain penerimaan → harus isi semua input
      const isValid =
        formData.aksiMitigasi.trim() !== "" &&
        formData.pemilik.trim() !== "" &&
        formData.targetWaktu.trim() !== "" &&
        formData.perkiraanBiaya.trim() !== "" &&
        formData.probabilitasResidual.trim() !== "" &&
        formData.dampakResidual.trim() !== "";

      if (!isValid) {
        setShowErrors(true);
        return;
      }
    }

    setShowErrors(false);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ==========================
  // SUBMIT RISIKO
  // ==========================
  const handleSubmit = async () => {
    try {
      if (!asset_id) return alert("Asset ID tidak ditemukan!");

      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan!");

      const foundCategory = riskCategories.find(
        (k) =>
          k.name?.toLowerCase() ===
          (formData.kategoriRisiko || "").toLowerCase()
      );
      const foundImpact = impactAreas.find(
        (a) =>
          a.name?.toLowerCase() === (formData.areaDampak || "").toLowerCase()
      );

      const payload = {
        risk: {
          type: formData.tipe,
          title: formData.namaRisiko,
          description: formData.deskripsiRisiko,
          cause: formData.penyebabRisiko.join(", "),
          impact: formData.dampakRisiko.join(", "),
          asset_id,
          probability: Number(formData.probabilitas),
          impact_score: Number(formData.dampak),
          criteria: formData.kriteriaDampak,
          priority: formData.prioritasRisiko,
          type_of_risk: (formData.jenisRisiko || "negatif").toLowerCase(),
          risk_category_id: foundCategory?.id || null,
          impact_area_id: foundImpact?.id || null,
        },
        treatments: [
          {
            strategy: (formData.strategi || "").toLowerCase() || null,
            action: formData.aksiMitigasi || null,
            action_owner: formData.pemilik || null,
            target_date: formData.targetWaktu
              ? new Date(formData.targetWaktu).toISOString().split("T")[0]
              : null,
            cost: formData.perkiraanBiaya
              ? Number(formData.perkiraanBiaya)
              : null,
            effectiveness: formData.efektivitas || null,
            new_probability: formData.probabilitasResidual
              ? Number(formData.probabilitasResidual)
              : null,
            new_impact_score: formData.dampakResidual
              ? Number(formData.dampakResidual)
              : null,
          },
        ],
      };

      const res = await axios.post<CreateRiskResponse>(
        "https://asset-risk-management.vercel.app/api/risks/with-treatments",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const id = res.data.risk.id;
      setNewRiskId(id);

      setShowPopup(true);
    } catch (err: any) {
      alert("Gagal submit risiko: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // POPUP BUTTON HANDLERS
  // ==========================
  const goToDetail = () => {
    if (!newRiskId) return;
    navigate(`/risiko-admin/${newRiskId}`);
  };

  const addAnotherRisk = () => {
    navigate(`/risiko-admin/tambah-risiko/${asset_id}`);
    window.location.reload(); // reset form
  };

  const goToDashboard = () => {
    navigate("/laporan/risiko-admin");
  };

  const handleClosePopup = () => setShowPopup(false);

  return (
    <>
      <div className="min-h-screenflex flex-col p-5 rounded-2xl">
        <div className="flex flex-col w-full mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Tambah Risiko</h1>

          <div className="flex items-center justify-center">
            <img
              src={
                isMobile
                  ? stepImages.mobile[step - 1]
                  : stepImages.desktop[step - 1]
              }
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
                showErrors={showErrors}
              />
            )}

            {step === 2 && (
              <Step2
                formData={formData}
                handleChange={handleChange}
                showErrors={showErrors}
                errors={errors}
              />
            )}
            {step === 3 && (
              <Step3
                formData={formData}
                handleChange={handleChange}
                showErrors={showErrors}
                errors={errors}
              />
            )}
            {step === 4 && <Step4 formData={formData} />}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Kembali
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg ml-auto ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Menyimpan..." : "Selesai"}
                </button>
              )}
            </div>
          </div>
        </div>

        {showPopup && (
          <SuccessPopup
            onClose={handleClosePopup}
            onSeeDetail={goToDetail}
            onAddAnother={addAnotherRisk}
            onDashboard={goToDashboard}
            riskInfo={{
              code: newRiskId || "ID Tidak Ada",
              name: formData.namaRisiko || "Nama Risiko",
            }}
          />
        )}
      </div>
    </>
  );
}
