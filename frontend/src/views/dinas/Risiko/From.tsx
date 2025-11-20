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
        setImpactAreas(impactRes.data || []);
        setRiskCategories(categoryRes.data || []);
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
        alert("Asset ID tidak ditemukan dari URL params!");
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

      const payload: any = {
        asset_id: asset_id,
        type: formData.tipe || "Aset",
        title: formData.namaRisiko,
        description: formData.deskripsiRisiko,
        cause: (formData.penyebabRisiko || [])
          .filter((p) => p.trim() !== "")
          .join(", "),
        impact: (formData.dampakRisiko || [])
          .filter((d) => d.trim() !== "")
          .join(", "),
        scenario_id: null,
        probability: Number(formData.probabilitas) || 1,
        impact_score: Number(formData.dampak) || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        criteria: formData.kriteriaDampak,
        entry_level: Number(formData.levelAwal) || null,
        priority: formData.prioritasRisiko || null,
        status: "planned",
        type_of_risk: formData.jenisRisiko || null,
        risk_category_id: foundCategory?.id || null,
        impact_area_id: foundImpact?.id || null,
        // department_id: "d86665d8-dd84-4802-97f8-fcce5eb3bd67",
        // treatments: [
        //   {
        //     strategy: formData.strategi || null,
        //     action: formData.aksiMitigasi || null,
        //     owner: formData.pemilik || null,
        //     due_date: formData.targetWaktu || null,
        //     estimated_cost: formData.perkiraanBiaya || null,
        //     effectiveness: formData.efektivitas || null,
        //     residual_level: formData.levelResidual || null,
        //     residual_probability: formData.probabilitasResidual || null,
        //     residual_impact: formData.dampakResidual || null,
        //   },
        // ],
      };

      // ------ Tambah token Bearer ------
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan, pastikan sudah login!");
        setLoading(false);
        return;
      }

      const formattedPayload: any = {
        ...payload,
        ...(payload.treatments && payload.treatments.length > 0
          ? {
              treatments: payload.treatments.map((t: any) => ({
                ...t,
                estimated_cost: Number(t.estimated_cost),
                residual_level: Number(t.residual_level),
                residual_probability: Number(t.residual_probability),
                residual_impact: Number(t.residual_impact),
              })),
            }
          : {}),
      };

      const res = await axios.post(
        "https://asset-risk-management.vercel.app/api/risks",
        formattedPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Success:", res.data);
      console.log("=== FINAL PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));
      setShowPopup(true);
    } catch (err: any) {
      console.error("Gagal submit:", err?.response ?? err);
      console.log("=== POST ERROR ===");

      if (err.config) {
        console.log("Data yang dikirim:", err.config.data);
        console.log("Headers:", err.config.headers);
        console.log("URL:", err.config.url);
        console.log("Method:", err.config.method);
      }

      if (err.response) {
        console.log("Status Error:", err.response.status);
        console.log("Response Error:", err.response.data);
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Error saat submit";
      alert(`Gagal submit risiko: ${msg}`);
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

            {step === 4 && (
              <>
                <h2 className="text-base font-semibold mb-6">
                  Langkah 4 — Konfirmasi Data Risiko
                </h2>

                <div className="space-y-4">
                  {/* Tipe */}
                  <div>
                    <label className="font-medium">Tipe</label>
                    <input
                      type="text"
                      value={formData.tipe || ""}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

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

                  {/* Penyebab Risiko (Array) */}
                  <div>
                    <label className="font-medium">Penyebab Risiko</label>
                    <input
                      value={(formData.penyebabRisiko || [])
                        .filter((p) => p.trim() !== "")
                        .join(", ")}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Dampak Risiko (Array) */}
                  <div>
                    <label className="font-medium">Dampak Risiko</label>
                    <input
                      value={(formData.dampakRisiko || [])
                        .filter((d) => d.trim() !== "")
                        .join(", ")}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Kategori Risiko */}
                  <div>
                    <label className="font-medium">Kategori Risiko</label>
                    <input
                      type="text"
                      value={formData.kategoriRisiko || ""}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Area Dampak */}
                  <div>
                    <label className="font-medium">Area Dampak</label>
                    <input
                      type="text"
                      value={formData.areaDampak || ""}
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
                    <input
                      type="text"
                      value={formData.kriteriaDampak}
                      disabled
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

                  {/* Jenis Risiko */}
                  <div>
                    <label className="font-medium">Jenis Risiko</label>
                    <input
                      type="text"
                      value={formData.jenisRisiko || ""}
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

                  {/* Aksi Mitigasi */}
                  <div>
                    <label className="font-medium">Aksi Mitigasi</label>
                    <input
                      type="text"
                      value={formData.aksiMitigasi}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Pemilik */}
                  <div>
                    <label className="font-medium">Pemilik</label>
                    <input
                      type="text"
                      value={formData.pemilik}
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

                  {/* Probabilitas Residual */}
                  <div>
                    <label className="font-medium">Probabilitas Residual</label>
                    <input
                      type="text"
                      value={formData.probabilitasResidual}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Dampak Residual */}
                  <div>
                    <label className="font-medium">Dampak Residual</label>
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
