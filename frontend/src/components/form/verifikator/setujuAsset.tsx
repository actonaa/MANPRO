/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { CircleHelp } from "lucide-react";
import axios from "axios";

interface AsetItem {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  status: string;
  tanggal: string;
}

interface SetujuAssetProps {
  aset: AsetItem;
  onClose: () => void;
}

const SetujuAsset: React.FC<SetujuAssetProps> = ({ aset, onClose }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleConfirm = async () => {
    try {
      setLoading(true);

      // PATCH approval status
      await axios.patch(
        `https://asset-risk-management.vercel.app/api/assets/${aset.id}/verify`,
        { approval_status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Aset berhasil disetujui.");
      onClose();

      // refresh halaman
      window.location.reload();
    } catch (error: any) {
      console.error(
        "Error approve asset:",
        error.response?.data || error.message
      );
      alert(
        "❌ Terjadi kesalahan saat menyetujui aset: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md text-center animate-fadeIn">
        <div className="flex justify-center mb-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <CircleHelp className="text-blue-500 w-6 h-6" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Konfirmasi Persetujuan
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Apakah Anda yakin ingin menyetujui aset ini?
        </p>

        <hr className="my-4 border-gray-300" />

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition w-full sm:w-auto"
          >
            Batal
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition w-full sm:w-auto"
          >
            {loading ? "Memproses..." : "Setuju"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetujuAsset;
