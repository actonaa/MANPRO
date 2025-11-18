import { type ChangeEvent } from "react";

export type FormDataNonTI = {
  material: string;
  ukuran: string;
};

interface StepNonTIProps {
  formData: FormDataNonTI;
  setFormData: React.Dispatch<React.SetStateAction<FormDataNonTI>>;
  nextStep?: () => void;
  prevStep?: () => void;
}

export default function StepNonTI({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: StepNonTIProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-xl font-semibold mb-4">
        Step 2 - Informasi Aset Non-TI
      </h2>

      {/* Material / Bahan */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Material / Bahan (Opsional)
        </label>
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder="Masukkan material / bahan aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Ukuran / Spesifikasi */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ukuran / Spesifikasi (Opsional)
        </label>
        <input
          type="text"
          name="ukuran"
          value={formData.ukuran}
          onChange={handleChange}
          placeholder="Masukkan ukuran / spesifikasi aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Tombol Navigasi */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
