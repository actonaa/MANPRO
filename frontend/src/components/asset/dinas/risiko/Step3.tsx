/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, type ChangeEvent } from "react";

interface Step3Props {
  formData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function Step3({ formData, handleChange }: Step3Props) {
  const isAccept = formData.strategi === "Accept";

  // hitung level residual otomatis
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

  // otomatis menentukan efektivitas
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

  return (
    <>
      <h2 className="text-base font-semibold mb-6">
        Langkah 3 — Rencana Penanganan Risiko
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kiri */}
        <div>
          {/* Strategi */}
          <div className="mb-4">
            <label className="font-medium">Strategy</label>
            <select
              name="strategi"
              value={formData.strategi}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="" disabled hidden>
                Pilih Strategi
              </option>
              {["Avoid", "Reduce", "Transfer", "Accept"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Aksi Mitigasi */}
          <div className="mb-4">
            <label className="font-medium">Action (Mitigation)</label>
            <input
              type="text"
              name="aksiMitigasi"
              placeholder="Masukkan tindakan mitigasi"
              value={formData.aksiMitigasi}
              onChange={handleChange}
              disabled={isAccept}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isAccept ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Action Owner */}
          <div className="mb-4">
            <label className="font-medium">Action Owner</label>
            <input
              type="text"
              name="pemilik"
              placeholder="Masukkan nama action owner"
              value={formData.pemilik}
              onChange={handleChange}
              disabled={isAccept}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isAccept ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Target Date */}
          <div className="mb-4">
            <label className="font-medium">Target Date</label>
            <input
              type="date"
              name="targetWaktu"
              value={formData.targetWaktu}
              onChange={handleChange}
              disabled={isAccept}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isAccept ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* Kanan */}
        <div>
          {/* Cost */}
          <div className="mb-4">
            <label className="font-medium">Cost</label>
            <input
              type="number"
              name="perkiraanBiaya"
              placeholder="ex: 30000000"
              value={formData.perkiraanBiaya}
              onChange={handleChange}
              disabled={isAccept}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isAccept ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Residual Probability */}
          <div className="mb-4">
            <label className="font-medium">New Probability</label>
            <select
              name="probabilitasResidual"
              value={formData.probabilitasResidual}
              onChange={handleChange}
              disabled={isAccept}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isAccept ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="" disabled hidden>
                Tentukan Level Probabilitas
              </option>
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Residual Impact */}
          <div className="mb-4">
            <label className="font-medium">New Impact Score</label>
            <select
              name="dampakResidual"
              value={formData.dampakResidual}
              onChange={handleChange}
              disabled={isAccept}
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                isAccept ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="" disabled hidden>
                Tentukan Level Dampak
              </option>
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Efektivitas */}
          <div className="mb-4">
            <label className="font-medium">Effectiveness</label>
            <input
              type="text"
              name="efektivitas"
              value={formData.efektivitas}
              disabled
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100"
            />
          </div>

          {/* Level Residual */}
          <div className="mb-4">
            <label className="font-medium">Residual Level</label>
            <input
              type="text"
              name="levelResidual"
              value={formData.levelResidual}
              disabled
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100"
            />
          </div>
        </div>
      </div>
    </>
  );
}
