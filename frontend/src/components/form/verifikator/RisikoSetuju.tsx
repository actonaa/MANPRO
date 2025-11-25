/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { CircleHelp } from "lucide-react";
import PopupJadwalPemeliharaan from "./JadwalPemeliharaan";
import axios from "axios";

interface KonfirmasiPersetujuanRisikoProps {
  namaRisiko: string;
  asetTerkait: string;
  asetId: string;
  onCancel?: () => void;
  onConfirm?: () => Promise<void>;
  loading?: boolean;
}

const KonfirmasiPersetujuanRisiko: React.FC<
  KonfirmasiPersetujuanRisikoProps
> = ({ namaRisiko, asetTerkait, asetId, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const token = localStorage.getItem("token");

  // Saat klik setuju, buka popup
  const handleConfirmClick = () => {
    setOpenPopup(true);
  };

  // Submit dari popup jadwal
  const handleSubmitJadwal = async (
    scheduled_date: string,
    priority: string,
    setPopupLoading: (state: boolean) => void
  ) => {
    try {
      setLoading(true);
      setPopupLoading(true);
      await axios.post(
        `https://asset-risk-management.vercel.app/api/maintenance/${asetId}`,
        { scheduled_date, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Jadwal pemeliharaan berhasil ditambahkan.");
      setOpenPopup(false);
      onCancel?.(); // tutup modal utama

      window.location.reload();
    } catch (error: any) {
      console.error(
        "Error submit planning-data:",
        error.response?.data || error.message
      );
      alert(
        "❌ Terjadi kesalahan saat menambahkan jadwal: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
      setPopupLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-[90%] sm:max-w-md mx-auto text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <CircleHelp className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Konfirmasi Persetujuan Risiko
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Risiko ini akan disetujui.
        </p>

        <div className="text-left text-xs sm:text-sm mt-4 space-y-2 border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <p className="text-gray-500">Nama Risiko</p>
            <p className="font-semibold text-gray-800 text-right max-w-[50%] break-words">
              {namaRisiko}
            </p>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <p className="text-gray-500">Aset Terkait</p>
            <p className="font-semibold text-gray-800 text-right max-w-[50%] break-words">
              {asetTerkait}
            </p>
          </div>
        </div>

        <p className="font-medium text-gray-700 mt-4 mb-4 text-sm sm:text-base">
          Apakah anda yakin?
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Setuju & Atur Jadwal"}
          </button>
        </div>
      </div>

      {/* Popup Jadwal */}
      <PopupJadwalPemeliharaan
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleSubmitJadwal}
      />
    </>
  );
};

export default KonfirmasiPersetujuanRisiko;
