import React, { useState } from "react";
import { CircleHelp } from "lucide-react";

interface AsetItem {
  id: string;
  nama: string;
  kategori: string;
  lokasi: string;
  kondisi: string;
  status: string;
  tanggal: string;
}

interface SetujuPenghapusanProps {
  aset: AsetItem;
  onClose: () => void;
}

const SetujuPenghapusan: React.FC<SetujuPenghapusanProps> = ({
  aset,
  onClose,
}) => {
  const [, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://asset-risk-management.vercel.app/api/assets/${aset.id}/verify-delete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: "accept",
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        alert("Gagal mengirim verifikasi!");
        return;
      }

      setOpenPopup(true);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Setuju */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md text-center animate-fadeIn">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <CircleHelp className="text-blue-500 w-6 h-6" />
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Konfirmasi Persetujuan Penghapusan
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Aset berikut akan disetujui penghapusan
          </p>

          <hr className="my-4 border-gray-300" />

          <p className="font-medium text-gray-700 mb-4">
            Apakah Anda yakin menyetujui penghapusan aset ini?
          </p>

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
              disabled={loading}
            >
              {loading ? "Memproses..." : "Setuju"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetujuPenghapusan;
