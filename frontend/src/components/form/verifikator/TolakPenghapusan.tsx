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

interface TolakPenghapusanProps {
  aset: AsetItem;
  onClose: () => void;
}

const TolakPenghapusan: React.FC<TolakPenghapusanProps> = ({
  aset,
  onClose,
}) => {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTolak = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (!alasan.trim()) {
      alert("Harap isi alasan penolakan.");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        `https://asset-risk-management.vercel.app/api/assets/${aset.id}/verify`,
        {
          approval_status: "rejected",
          revisian_notes: alasan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Aset berhasil ditolak.");
      onClose();

      window.location.reload();
    } catch (error: any) {
      console.error("Error menolak aset:", error.response || error.message);
      alert("Gagal menolak aset. Silakan cek console untuk detail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md text-center animate-fadeIn">
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 p-3 rounded-full">
            <CircleHelp className="text-red-500 w-6 h-6" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Konfirmasi Penolakan
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Aset akan dikembalikan ke pengguna dinas untuk diperbaiki.
        </p>

        <hr className="my-4 border-gray-300" />

        <div className="text-left mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alasan Penolakan
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Tuliskan alasan penolakan aset..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <p className="font-medium text-gray-700 mb-4">
          Apakah Anda yakin ingin menolak aset ini?
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition w-full sm:w-auto"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleTolak}
            className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Tolak Aset"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TolakPenghapusan;
