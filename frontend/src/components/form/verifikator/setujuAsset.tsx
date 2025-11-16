import React, { useState } from "react";
import { CircleHelp } from "lucide-react";
import PopupJadwalPemeliharaan from "../verifikator/JadwalPemeliharaan";

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
  const [openPopup, setOpenPopup] = useState(false);

  const handleConfirm = () => {
    setOpenPopup(true);
  };

  const handleSubmitJadwal = (tanggal: string) => {
    console.log("📅 Jadwal dipilih:", tanggal);
    console.log("✅ Aset disetujui:", aset);

    // TODO: Kirim API
    setOpenPopup(false);
    onClose();
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
            Konfirmasi Persetujuan
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Aset berikut akan disetujui. Silakan atur jadwal pemeliharaan.
          </p>

          <hr className="my-4 border-gray-300" />

          <p className="font-medium text-gray-700 mb-4">
            Apakah Anda yakin ingin menyetujui aset ini?
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
            >
              Setuju & Atur Jadwal
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      <PopupJadwalPemeliharaan
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleSubmitJadwal}
      />
    </>
  );
};

export default SetujuAsset;
