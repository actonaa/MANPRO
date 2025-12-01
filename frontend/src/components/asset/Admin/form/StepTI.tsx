import { type ChangeEvent } from "react";

export type FormDataTI = {
  ipAddress: string;
  hostname: string;
  os: string;
  version: string;
  tanggalDeployment: string;
  url: string;
  serialNumber: string;
};

interface StepTIProps {
  formData: FormDataTI;
  setFormData: React.Dispatch<React.SetStateAction<FormDataTI>>;
  nextStep?: () => void;
  prevStep?: () => void;
}

export default function StepTIAdmin({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: StepTIProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-lg font-semibold mb-2">Step 2 - Informasi Aset TI</h2>

      {/* IP Address */}
      <div>
        <label className="block text-sm font-medium mb-1">
          IP Address (Opsional)
        </label>
        <input
          type="text"
          name="ipAddress"
          value={formData.ipAddress}
          onChange={handleChange}
          placeholder="Masukkan IP Address (192.xxx.xx.xxx)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Hostname */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Hostname (Opsional)
        </label>
        <input
          type="text"
          name="hostname"
          value={formData.hostname}
          onChange={handleChange}
          placeholder="Masukkan Hostname"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* OS */}
      <div>
        <label className="block text-sm font-medium mb-1">OS (Opsional)</label>
        <input
          type="text"
          name="os"
          value={formData.os}
          onChange={handleChange}
          placeholder="Masukkan OS"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Version */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Version (Opsional)
        </label>
        <input
          type="text"
          name="version"
          value={formData.version}
          onChange={handleChange}
          placeholder="Masukkan versi aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Tanggal Deployment */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tanggal Deployment (Opsional)
        </label>
        <input
          type="date"
          name="tanggalDeployment"
          value={formData.tanggalDeployment}
          onChange={handleChange}
          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium mb-1">URL (Opsional)</label>
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="Masukkan URL (example.com)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Serial Number Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Serial Number Aset (Opsional)
        </label>
        <input
          type="text"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          placeholder="Masukkan Nomor Serial Aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
