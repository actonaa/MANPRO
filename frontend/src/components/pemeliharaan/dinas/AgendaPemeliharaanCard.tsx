/* eslint-disable @typescript-eslint/no-explicit-any */

import { Upload } from "lucide-react";
import { useState } from "react";

interface Props {
  maintenanceId: string;
}

export default function AgendaPemeliharaanCard({ maintenanceId }: Props) {
  const token = localStorage.getItem("token");

  const [type, setType] = useState(""); // terjadwal / insidental
  const [completionDate, setCompletionDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  // ============================
  // HANDLE FILE UPLOAD
  // ============================
  const handleFileChange = (e: any) => {
    const uploaded = e.target.files[0];

    if (uploaded && uploaded.size > 1_000_000) {
      alert("Ukuran file maksimal 1 MB");
      return;
    }
    setFile(uploaded);
  };

  // ============================
  // SUBMIT PATCH COMPLETE
  // ============================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", type || "");
      formData.append("completion_date", completionDate || "");
      formData.append("vendor", vendor || "");
      formData.append("cost", cost || "");
      formData.append("notes", notes || "");
      if (file) formData.append("proof", file);

      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/maintenance/${maintenanceId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const json = await res.json();

      if (!res.ok) {
        console.log(json);
        alert("Gagal menyimpan data!");
      } else {
        alert("Pemeliharaan berhasil diselesaikan!");
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Error submit:", error);
      alert("Terjadi kesalahan saat mengirim data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="text-lg font-semibold pt-5 mb-5 text-gray-800">
        Agenda Pemeliharaan
      </h2>

      <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
        {/* Grid Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type Pemeliharaan */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">
              Jenis Pemeliharaan
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="" disabled>
                Pilih jenis pemeliharaan
              </option>
              <option value="terjadwal">Terjadwal</option>
              <option value="insidental">Insidental</option>
            </select>
          </div>

          {/* Tanggal Realisasi */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">
              Tanggal Realisasi
            </label>
            <input
              type="date"
              value={completionDate}
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          {/* Biaya */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">
              Biaya
            </label>
            <input
              type="number"
              placeholder="Rp 0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Vendor */}
          <div className="flex flex-col">
            <label className="block mb-2 text-gray-600 font-medium">
              Vendor
            </label>
            <input
              type="text"
              placeholder="Nama vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col md:col-span-2">
            <label className="block mb-2 text-gray-600 font-medium">
              Deskripsi
            </label>
            <input
              type="text"
              placeholder="Deskripsi pemeliharaan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Upload Bukti */}
        <div className="flex flex-col">
          <label className="block mb-2 text-gray-600 font-medium">
            Unggah Bukti
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="uploadFile"
            />
            <label
              htmlFor="uploadFile"
              className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Unggah Dokumen
            </label>
            <p className="text-sm text-gray-500 mt-3">
              File ukuran maksimal 1 MB
            </p>
            {file && (
              <p className="mt-2 text-gray-700 font-medium">{file.name}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
