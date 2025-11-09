import { type ChangeEvent } from "react";

export type FormDataTI = {
  ipAddress: string;
  os: string;
  version: string;
  cpu: string;
  ram: string;
  storage: string;
  tanggalDeployment: string;
  vendor: string;
  url: string;
  serialNumber: string;
};

interface StepTIProps {
  formData: FormDataTI;
  setFormData: React.Dispatch<React.SetStateAction<FormDataTI>>;
  nextStep?: () => void;
  prevStep?: () => void;
}

export default function StepTI({
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
      <h2 className="text-lg font-semibold mb-2">Unggah dokumen</h2>

      {/* IP Address */}
      <div>
        <label className="block text-sm font-medium mb-1">IP Address</label>
        <input
          type="text"
          name="ipAddress"
          value={formData.ipAddress}
          onChange={handleChange}
          placeholder="Masukkan IP Address"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* OS */}
      <div>
        <label className="block text-sm font-medium mb-1">OS</label>
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
        <label className="block text-sm font-medium mb-1">Version</label>
        <input
          type="text"
          name="version"
          value={formData.version}
          onChange={handleChange}
          placeholder="Masukkan versi aset"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* CPU */}
      <div>
        <label className="block text-sm font-medium mb-1">CPU</label>
        <input
          type="text"
          name="cpu"
          value={formData.cpu}
          onChange={handleChange}
          placeholder="Masukkan CPU"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* RAM */}
      <div>
        <label className="block text-sm font-medium mb-1">RAM</label>
        <input
          type="text"
          name="ram"
          value={formData.ram}
          onChange={handleChange}
          placeholder="Masukkan RAM"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Storage */}
      <div>
        <label className="block text-sm font-medium mb-1">Storage</label>
        <input
          type="text"
          name="storage"
          value={formData.storage}
          onChange={handleChange}
          placeholder="Masukkan Storage"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Tanggal Deployment */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tanggal Deployment
        </label>
        <input
          type="date"
          name="tanggalDeployment"
          value={formData.tanggalDeployment}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Vendor */}
      <div>
        <label className="block text-sm font-medium mb-1">Vendor</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          placeholder="Masukkan Vendor"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium mb-1">URL</label>
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="Masukkan URL"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Serial Number Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Serial Number Aset
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
