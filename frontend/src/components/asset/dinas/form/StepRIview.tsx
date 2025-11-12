import { type FormDataTI } from "./TI";
import { type FormDataNonTI } from "./Non-TI";
import { type AsetFormData } from "./Step1";

interface StepReviewProps {
  formData: AsetFormData;
  formDataTI: FormDataTI;
  formDataNonTI: FormDataNonTI;
  prevStep: () => void;
}

export default function StepReview({
  formData,
  formDataTI,
  formDataNonTI,
  prevStep,
}: StepReviewProps) {
  const isTI = formData.kategoriAset.toLowerCase() === "ti";

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Step 3 - Konfirmasi Data</h2>

      {/* Step 1 - Data Umum */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Informasi Umum Aset</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-gray-500 text-sm">{key}</span>
              <input
                type="text"
                value={value}
                disabled
                className="border border-gray-300 rounded px-2 py-1 bg-gray-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step TI & Non-TI */}
      <div className="flex gap-6">
        {/* TI */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Form TI</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(formDataTI).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-gray-500 text-sm">{key}</span>
                <input
                  type="text"
                  value={value}
                  disabled={!isTI}
                  className={`border rounded px-2 py-1 ${
                    isTI ? "border-gray-300 bg-gray-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Non-TI */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Form Non-TI</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(formDataNonTI).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-gray-500 text-sm">{key}</span>
                <input
                  type="text"
                  value={value as string}
                  disabled={isTI}
                  className={`border rounded px-2 py-1 ${
                    !isTI ? "border-gray-300 bg-gray-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Kembali
        </button>
        <button
          onClick={() => alert("Data tersimpan!")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
