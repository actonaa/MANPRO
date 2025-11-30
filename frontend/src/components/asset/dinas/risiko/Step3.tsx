/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from "react";

interface Step3Props {
  formData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
}

export default function Step3({
  formData,
  handleChange,
  showErrors,
}: Step3Props) {
  const isPenerimaan =
    formData.strategi === "Penerimaan Risiko" || formData.strategi === "";

  // ==============================
  // HITUNG LEVEL RESIDUAL OTOMATIS
  // ==============================
  useEffect(() => {
    const p = Number(formData.probabilitasResidual);
    const d = Number(formData.dampakResidual);

    if (!p || !d) return;

    const hasil = p * d;

    if (formData.levelResidual !== hasil.toString()) {
      handleChange({
        target: { name: "levelResidual", value: hasil.toString() },
      } as any);
    }
  }, [
    formData.probabilitasResidual,
    formData.dampakResidual,
    formData.levelResidual,
    handleChange,
  ]);

  // ==============================
  // HITUNG EFEKTIVITAS OTOMATIS
  // ==============================
  useEffect(() => {
    const level = Number(formData.levelResidual);
    if (!level) return;

    let efektivitasValue = "";

    if (level <= 6) efektivitasValue = "Rendah";
    else if (level <= 14) efektivitasValue = "Sedang";
    else efektivitasValue = "Tinggi";

    if (formData.efektivitas !== efektivitasValue) {
      handleChange({
        target: { name: "efektivitas", value: efektivitasValue },
      } as any);
    }
  }, [formData.levelResidual, formData.efektivitas, handleChange]);

  // ==============================
  // ERROR STATE HANYA UNTUK NEXT
  // ==============================
  const [localErrors, setLocalErrors] = useState<any>({});

  useEffect(() => {
    if (!showErrors) {
      setLocalErrors({});
      return;
    }

    const newErrors: any = {};
    if (!formData.strategi) newErrors.strategi = "Strategi wajib dipilih";
    if (!formData.aksiMitigasi && !isPenerimaan)
      newErrors.aksiMitigasi = "Aksi wajib diisi";
    if (!formData.pemilik && !isPenerimaan)
      newErrors.pemilik = "Pemilik wajib diisi";
    if (!formData.targetWaktu && !isPenerimaan)
      newErrors.targetWaktu = "Target waktu wajib diisi";
    if (!formData.probabilitasResidual && !isPenerimaan)
      newErrors.probabilitasResidual = "Probabilitas wajib dipilih";
    if (!formData.dampakResidual && !isPenerimaan)
      newErrors.dampakResidual = "Dampak wajib dipilih";
    if (!formData.perkiraanBiaya && !isPenerimaan)
      newErrors.perkiraanBiaya = "Biaya wajib diisi";

    setLocalErrors(newErrors);
  }, [formData, isPenerimaan, showErrors]);

  // ==============================
  // DATA STRATEGI
  // ==============================
  const strategiNegatif = [
    "Eskalasi Risiko",
    "Mitigasi Risiko",
    "Transfer Risiko",
    "Penghindaran Risiko",
    "Penerimaan Risiko",
  ];

  const strategiPositif = [
    "Eskalasi Risiko",
    "Eksploitasi Risiko",
    "Peningkatan Risiko",
    "Pembagian Risiko",
    "Penerimaan Risiko",
  ];

  return (
    <>
      <h2 className="text-base font-semibold mb-6">
        Langkah 3 — Rencana Penanganan Risiko
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ===================== */}
        <div>
          {/* STRATEGI RISIKO */}
          <div className="mb-6">
            <label className="font-medium">Strategi Risiko</label>
            <select
              name="strategi"
              value={formData.strategi}
              onChange={handleChange}
              className={`w-full border px-3 py-2 mt-1 rounded-lg ${
                localErrors.strategi ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                Pilih Strategi Risiko
              </option>
              {formData.jenisRisiko === "Negatif" &&
                strategiNegatif.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              {formData.jenisRisiko === "Positif" &&
                strategiPositif.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
            {localErrors.strategi && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.strategi}
              </p>
            )}
          </div>

          {/* AKSI MITIGASI */}
          <div className="mb-4">
            <label className="font-medium">Aksi</label>
            <input
              type="text"
              name="aksiMitigasi"
              value={formData.aksiMitigasi}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan
                  ? "bg-gray-100 cursor-not-allowed"
                  : localErrors.aksiMitigasi
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {localErrors.aksiMitigasi && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.aksiMitigasi}
              </p>
            )}
          </div>

          {/* PEMILIK */}
          <div className="mb-4">
            <label className="font-medium">Pemilik Risiko</label>
            <input
              type="text"
              name="pemilik"
              value={formData.pemilik}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan
                  ? "bg-gray-100 cursor-not-allowed"
                  : localErrors.pemilik
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {localErrors.pemilik && (
              <p className="text-red-500 text-sm mt-1">{localErrors.pemilik}</p>
            )}
          </div>

          {/* TARGET WAKTU */}
          <div className="mb-4">
            <label className="font-medium">Target Waktu</label>
            <input
              type="date"
              name="targetWaktu"
              value={formData.targetWaktu}
              onChange={handleChange}
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              disabled={isPenerimaan}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan
                  ? "bg-gray-100 cursor-not-allowed"
                  : localErrors.targetWaktu
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {localErrors.targetWaktu && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.targetWaktu}
              </p>
            )}
          </div>
        </div>

        {/* ===================== */}
        <div>
          {/* BIAYA */}
          <div className="mb-4">
            <label className="font-medium">Biaya</label>
            <input
              type="number"
              name="perkiraanBiaya"
              value={formData.perkiraanBiaya}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan
                  ? "bg-gray-100 cursor-not-allowed"
                  : localErrors.perkiraanBiaya
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {localErrors.perkiraanBiaya && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.perkiraanBiaya}
              </p>
            )}
          </div>

          {/* PROBABILITAS RESIDUAL */}
          <div className="mb-4">
            <label className="font-medium">Probabilitas Residual</label>
            <select
              name="probabilitasResidual"
              value={formData.probabilitasResidual}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan
                  ? "bg-gray-100 cursor-not-allowed"
                  : localErrors.probabilitasResidual
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                Pilih Probabilitas
              </option>
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {localErrors.probabilitasResidual && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.probabilitasResidual}
              </p>
            )}
          </div>

          {/* DAMPAK RESIDUAL */}
          <div className="mb-4">
            <label className="font-medium">Dampak Residual</label>
            <select
              name="dampakResidual"
              value={formData.dampakResidual}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan
                  ? "bg-gray-100 cursor-not-allowed"
                  : localErrors.dampakResidual
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                Pilih Dampak
              </option>
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {localErrors.dampakResidual && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.dampakResidual}
              </p>
            )}
          </div>

          {/* EFEKTIVITAS */}
          <div className="mb-4">
            <label className="font-medium">Efektivitas</label>
            <input
              type="text"
              name="efektivitas"
              value={formData.efektivitas}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100"
            />
          </div>

          {/* LEVEL RESIDUAL */}
          <div className="mb-4">
            <label className="font-medium">Level Residual</label>
            <input
              type="text"
              name="levelResidual"
              value={formData.levelResidual}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100"
            />
          </div>
        </div>
      </div>
    </>
  );
}
