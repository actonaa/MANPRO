/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from "react";
import { Plus, Trash } from "lucide-react";

interface Step1Props {
  formData: any;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleArrayChange: (
    type: "penyebab" | "dampak",
    index: number,
    value: string
  ) => void;
  handleAddField: (type: "penyebab" | "dampak") => void;
  handleRemoveField: (field: "penyebab" | "dampak", index: number) => void;
}

export default function Step1({
  formData,
  handleChange,
  handleArrayChange,
  handleAddField,
  handleRemoveField,
}: Step1Props) {
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [areaList, setAreaList] = useState<any[]>([]);

  // Fetch kategori risiko & area dampak
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [riskRes, areaRes] = await Promise.all([
          fetch("https://asset-risk-management.vercel.app/api/risk-categories"),
          fetch("https://asset-risk-management.vercel.app/api/impact-area"),
        ]);

        const riskData = await riskRes.json();
        const areaData = await areaRes.json();

        setKategoriList(riskData);
        setAreaList(areaData);
      } catch (error) {
        console.error("Gagal fetch dropdown:", error);
      }
    };

    fetchDropdowns();
  }, []);

  return (
    <>
      <h2 className="text-base font-semibold mb-6">
        Langkah 1 — Identifikasi Risiko
      </h2>

      {/* Tipe (Dropdown) */}
      <div className="mb-4">
        <label className="font-medium">Tipe</label>
        <select
          name="tipe"
          value={formData.tipe || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
        >
          <option value="Aset">Aset</option>
          <option value="Skenario">Skenario</option>
        </select>
      </div>

      {/* Jenis Risiko */}
      <div className="mb-6">
        <label className="font-medium">Jenis Risiko</label>
        <select
          name="jenisRisiko"
          value={formData.jenisRisiko}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-700"
        >
          <option value="" disabled hidden>
            Pilih Jenis Risiko
          </option>
          <option value="Negatif">Negatif</option>
          <option value="Positif">Positif</option>
        </select>
      </div>

      {/* Nama Risiko */}
      <div className="mb-4">
        <label className="font-medium">Nama Risiko</label>
        <input
          type="text"
          name="namaRisiko"
          placeholder="Masukkan Nama Risiko"
          value={formData.namaRisiko}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
        />
      </div>

      {/* Deskripsi Risiko */}
      <div className="mb-4">
        <label className="font-medium">Deskripsi Risiko</label>
        <textarea
          name="deskripsiRisiko"
          placeholder="Masukkan Deskripsi Risiko"
          value={formData.deskripsiRisiko}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
          rows={4}
        />
      </div>

      {/* Penyebab Risiko */}
      <div className="mb-4">
        <label className="font-medium">Penyebab Risiko</label>
        {formData.penyebabRisiko.map((penyebab: string, index: number) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              placeholder="Masukkan Penyebab Risiko"
              value={penyebab}
              onChange={(e) =>
                handleArrayChange("penyebab", index, e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            {index === formData.penyebabRisiko.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField("penyebab")}
                className="ml-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {formData.penyebabRisiko.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField("penyebab", index)}
                className="ml-2 p-2 rounded-md border border-gray-300 hover:bg-red-100"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Kategori Risiko (Dropdown API) */}
      <div className="mb-4">
        <label className="font-medium">Kategori Risiko</label>
        <select
          name="kategoriRisiko"
          value={formData.kategoriRisiko || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Pilih Kategori Risiko</option>
          {kategoriList.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dampak Risiko */}
      <div className="mb-4">
        <label className="font-medium">Dampak Risiko</label>
        {formData.dampakRisiko.map((dampak: string, index: number) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              placeholder="Masukkan Dampak Risiko"
              value={dampak}
              onChange={(e) =>
                handleArrayChange("dampak", index, e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            {index === formData.dampakRisiko.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField("dampak")}
                className="ml-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {formData.dampakRisiko.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField("dampak", index)}
                className="ml-2 p-2 rounded-md border border-gray-300 hover:bg-red-100"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Area Dampak (Dropdown API) */}
      <div className="mb-4">
        <label className="font-medium">Area Dampak</label>
        <select
          name="areaDampak"
          value={formData.areaDampak || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Pilih Area Dampak</option>
          {areaList.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
