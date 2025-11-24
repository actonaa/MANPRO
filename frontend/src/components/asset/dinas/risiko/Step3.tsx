/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, type ChangeEvent } from "react";

interface Step3Props {
  formData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function Step3({ formData, handleChange }: Step3Props) {
  const isPenerimaan = formData.strategi === "Penerimaan Risiko";

  // ==============================
  //  HITUNG LEVEL RESIDUAL OTOMATIS
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
  //  HITUNG EFEKTIVITAS OTOMATIS
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
  //  STRATEGI BARU (POSITIF & NEGATIF)
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
        {/*     BAGIAN KIRI       */}
        {/* ===================== */}
        <div>
          {/* STRATEGI RISIKO */}
          <div className="mb-6">
            <label className="font-medium">Strategi Risiko</label>
            <select
              name="strategi"
              value={formData.strategi}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
          </div>

          {/* AKSI MITIGASI */}
          <div className="mb-4">
            <label className="font-medium">Aksi</label>
            <input
              type="text"
              name="aksiMitigasi"
              placeholder="Masukkan tindakan mitigasi"
              value={formData.aksiMitigasi}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* PEMILIK */}
          <div className="mb-4">
            <label className="font-medium">Pemilik Risiko</label>
            <input
              type="text"
              name="pemilik"
              placeholder="Masukkan nama pemilik risiko"
              value={formData.pemilik}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* TARGET WAKTU */}
          <div className="mb-4">
            <label className="font-medium">Target Waktu</label>
            <input
              type="date"
              name="targetWaktu"
              value={formData.targetWaktu}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* ===================== */}
        {/*     BAGIAN KANAN      */}
        {/* ===================== */}
        <div>
          {/* BIAYA */}
          <div className="mb-4">
            <label className="font-medium">Biaya</label>
            <input
              type="number"
              name="perkiraanBiaya"
              placeholder="Contoh: 30000000"
              value={formData.perkiraanBiaya}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* PROBABILITAS RESIDUAL */}
          <div className="mb-4">
            <label className="font-medium">Probabilitas Residual</label>
            <select
              name="probabilitasResidual"
              value={formData.probabilitasResidual}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan ? "bg-gray-100 cursor-not-allowed" : ""
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
          </div>

          {/* DAMPAK RESIDUAL */}
          <div className="mb-4">
            <label className="font-medium">Dampak Residual</label>
            <select
              name="dampakResidual"
              value={formData.dampakResidual}
              onChange={handleChange}
              disabled={isPenerimaan}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                isPenerimaan ? "bg-gray-100 cursor-not-allowed" : ""
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
