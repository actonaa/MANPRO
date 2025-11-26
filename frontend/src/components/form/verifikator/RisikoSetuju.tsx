/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { CircleHelp } from "lucide-react";
import PopupJadwalPemeliharaan from "./JadwalPemeliharaan";
import axios from "axios";

interface RisikoSetujuProps {
  namaRisiko: string;
  asetTerkait: string;
  asetId: string;
  onCancel?: () => void;
  onConfirm?: () => Promise<void>; // ACC risiko
  loading?: boolean;
}

const RisikoSetuju: React.FC<RisikoSetujuProps> = ({
  namaRisiko,
  asetTerkait,
  asetId,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Sekarang tombol ini hanya membuka popup
  const handleConfirmClick = () => {
    setOpenPopup(true);
  };

  // 1. Simpan jadwal
  // 2. Setelah berhasil → ACC risiko dengan onConfirm()
  const handleSubmitJadwal = async (
    scheduled_date: string,
    priority: string,
    setPopupLoading: (state: boolean) => void
  ) => {
    try {
      setLocalLoading(true);
      setPopupLoading(true);

      // SIMPAN JADWAL
      await axios.post(
        `https://asset-risk-management.vercel.app/api/maintenance/${asetId}`,
        { scheduled_date, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ACC RISIKO SETELAH JADWAL BERHASIL
      if (onConfirm) await onConfirm();

      alert("Risiko disetujui dan jadwal pemeliharaan berhasil ditambahkan.");

      setOpenPopup(false);
      onCancel?.();
      window.location.reload();
    } catch (error: any) {
      console.error(
        "Error submit planning-data:",
        error.response?.data || error.message
      );
      alert(
        "Terjadi kesalahan saat submit jadwal: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLocalLoading(false);
      setPopupLoading(false);
    }
  };

  return (
    <>
      {/* MODAL KONFIRMASI */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] sm:max-w-md mx-auto text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <CircleHelp className="text-blue-500 w-7 h-7" />
          </div>
        </div>

        <h2 className="text-lg font-semibold">Konfirmasi Persetujuan Risiko</h2>
        <p className="text-gray-600 text-sm mt-1">Risiko ini akan disetujui.</p>

        <div className="text-left text-sm mt-4 space-y-2 border-t border-gray-200 pt-3">
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

        <p className="font-medium text-gray-700 mt-4 mb-4">
          Apakah anda yakin?
        </p>

        <div className="flex gap-3 flex-col sm:flex-row justify-center">
          <button
            onClick={onCancel}
            disabled={loading || localLoading}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={handleConfirmClick}
            disabled={loading || localLoading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50"
          >
            {loading || localLoading ? "Memproses..." : "Setuju & Atur Jadwal"}
          </button>
        </div>
      </div>

      {/* POPUP */}
      <PopupJadwalPemeliharaan
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleSubmitJadwal}
      />
    </>
  );
};

export default RisikoSetuju;
