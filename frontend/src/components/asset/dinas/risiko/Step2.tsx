/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChangeEvent } from "react";

interface Step2Props {
  formData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function Step2({ formData, handleChange }: Step2Props) {
  return (
    <>
      <h2 className="text-base font-semibold mb-6">
        Langkah 2 — Analisis Risiko
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HEATMAP */}
        <div className="order-1 lg:order-2">
          <div className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <img
              src="/kelola-risiko/heatmap-risiko.png"
              alt="Heatmap Risiko"
              className="w-full rounded-lg object-contain"
            />
          </div>
        </div>

        {/* FORM */}
        <div className="order-2 lg:order-1">
          {/* Probabilitas */}
          <div className="mb-4">
            <label className="font-medium">Probabilitas</label>
            <select
              name="probabilitas"
              value={formData.probabilitas}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-700"
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

          {/* Dampak */}
          <div className="mb-4">
            <label className="font-medium">Dampak</label>
            <select
              name="dampak"
              value={formData.dampak}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-700"
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

          {/* Level Awal */}
          <div className="mb-6">
            <label className="font-medium">Level Awal</label>
            <input
              type="text"
              name="levelAwal"
              placeholder="Hasil P×D"
              value={formData.levelAwal}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Jenis Risiko */}
          <div className="mb-6">
            <label className="font-medium">Jenis Risiko</label>
            <input
              type="text"
              name="jenisRisiko"
              placeholder="Jenis Risiko"
              value={formData.jenisRisiko}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Kriteria */}
          <div className="mb-4">
            <label className="font-medium">Kriteria</label>
            <input
              name="kriteriaDampak"
              placeholder="Masukkan Kriteria Dampak"
              value={formData.kriteriaDampak}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Prioritas Risiko */}
          <div className="mb-4">
            <label className="font-medium">Prioritas Risiko</label>
            <select
              name="prioritasRisiko"
              value={formData.prioritasRisiko}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-700"
            >
              <option value="" disabled hidden>
                Pilih Prioritas
              </option>
              {["Tinggi", "Sedang", "Rendah"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
