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

  // ⬇️ Tambahan
  showErrors: boolean;
}

export default function Step1({
  formData,
  handleChange,
  handleArrayChange,
  handleAddField,
  handleRemoveField,
  showErrors,
}: Step1Props) {
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [areaList, setAreaList] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  // VALIDASI
  useEffect(() => {
    const newErrors: any = {};

    if (!formData.tipe) newErrors.tipe = "Tipe wajib diisi";
    if (!formData.jenisRisiko)
      newErrors.jenisRisiko = "Jenis risiko wajib diisi";
    if (!formData.namaRisiko) newErrors.namaRisiko = "Nama risiko wajib diisi";
    if (!formData.deskripsiRisiko)
      newErrors.deskripsiRisiko = "Deskripsi wajib diisi";

    if (formData.penyebabRisiko.some((v: string) => !v))
      newErrors.penyebabRisiko = "Semua penyebab harus diisi";

    if (!formData.kategoriRisiko)
      newErrors.kategoriRisiko = "Kategori wajib diisi";

    if (formData.dampakRisiko.some((v: string) => !v))
      newErrors.dampakRisiko = "Semua dampak harus diisi";

    if (!formData.areaDampak) newErrors.areaDampak = "Area dampak wajib diisi";

    setErrors(newErrors);
  }, [formData]);

  // FETCH DROPDOWN
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

      {/* TIPE */}
      <div className="mb-4">
        <label className="font-medium">Tipe</label>
        <select
          name="tipe"
          value={formData.tipe || ""}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            showErrors && errors.tipe ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            Pilih Tipe
          </option>
          <option value="Aset">Aset</option>
          <option value="Skenario">Skenario</option>
        </select>
        {showErrors && errors.tipe && (
          <p className="text-red-500 text-sm mt-1">{errors.tipe}</p>
        )}
      </div>

      {/* JENIS RISIKO */}
      <div className="mb-6">
        <label className="font-medium">Jenis Risiko</label>
        <select
          name="jenisRisiko"
          value={formData.jenisRisiko || ""}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            showErrors && errors.jenisRisiko
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            Pilih Jenis Risiko
          </option>
          <option value="Negatif">Negatif</option>
          <option value="Positif">Positif</option>
        </select>
        {showErrors && errors.jenisRisiko && (
          <p className="text-red-500 text-sm mt-1">{errors.jenisRisiko}</p>
        )}
      </div>

      {/* NAMA RISIKO */}
      <div className="mb-4">
        <label className="font-medium">Nama Risiko</label>
        <input
          type="text"
          name="namaRisiko"
          placeholder="Masukkan Nama Risiko"
          value={formData.namaRisiko || ""}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            showErrors && errors.namaRisiko
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {showErrors && errors.namaRisiko && (
          <p className="text-red-500 text-sm mt-1">{errors.namaRisiko}</p>
        )}
      </div>

      {/* DESKRIPSI */}
      <div className="mb-4">
        <label className="font-medium">Deskripsi Risiko</label>
        <textarea
          name="deskripsiRisiko"
          placeholder="Masukkan Deskripsi Risiko"
          value={formData.deskripsiRisiko || ""}
          onChange={handleChange}
          rows={4}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            showErrors && errors.deskripsiRisiko
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {showErrors && errors.deskripsiRisiko && (
          <p className="text-red-500 text-sm mt-1">{errors.deskripsiRisiko}</p>
        )}
      </div>

      {/* PENYEBAB */}
      <div className="mb-4">
        <label className="font-medium">Penyebab Risiko</label>

        {formData.penyebabRisiko.map((penyebab: string, index: number) => {
          const isError = showErrors && penyebab.trim() === "";

          return (
            <div key={index} className="mt-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Masukkan Penyebab Risiko"
                  value={penyebab}
                  onChange={(e) =>
                    handleArrayChange("penyebab", index, e.target.value)
                  }
                  className={`w-full border rounded-lg px-3 py-2 ${
                    isError ? "border-red-500" : "border-gray-300"
                  }`}
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
            </div>
          );
        })}

        {showErrors && errors.penyebabRisiko && (
          <p className="text-red-500 text-sm mt-1">{errors.penyebabRisiko}</p>
        )}
      </div>

      {/* KATEGORI */}
      <div className="mb-4">
        <label className="font-medium">Kategori Risiko</label>
        <select
          name="kategoriRisiko"
          value={formData.kategoriRisiko || ""}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            showErrors && errors.kategoriRisiko
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Pilih Kategori Risiko</option>
          {kategoriList.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        {showErrors && errors.kategoriRisiko && (
          <p className="text-red-500 text-sm mt-1">{errors.kategoriRisiko}</p>
        )}
      </div>

      {/* DAMPAK */}
      <div className="mb-4">
        <label className="font-medium">Dampak Risiko</label>

        {formData.dampakRisiko.map((dampak: string, index: number) => {
          const isError = showErrors && dampak.trim() === "";

          return (
            <div key={index} className="mt-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Masukkan Dampak Risiko"
                  value={dampak}
                  onChange={(e) =>
                    handleArrayChange("dampak", index, e.target.value)
                  }
                  className={`w-full border rounded-lg px-3 py-2 ${
                    isError ? "border-red-500" : "border-gray-300"
                  }`}
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
            </div>
          );
        })}

        {showErrors && errors.dampakRisiko && (
          <p className="text-red-500 text-sm mt-1">{errors.dampakRisiko}</p>
        )}
      </div>

      {/* AREA DAMPAK */}
      <div className="mb-6">
        <label className="font-medium">Area Dampak</label>
        <select
          name="areaDampak"
          value={formData.areaDampak || ""}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            showErrors && errors.areaDampak
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Pilih Area Dampak</option>
          {areaList.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        {showErrors && errors.areaDampak && (
          <p className="text-red-500 text-sm mt-1">{errors.areaDampak}</p>
        )}
      </div>
    </>
  );
}
