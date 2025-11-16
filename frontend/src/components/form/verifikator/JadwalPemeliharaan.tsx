import React, { useState, useRef } from "react";

interface PopupJadwalPemeliharaanProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tanggal: string) => void;
}

const PopupJadwalPemeliharaan: React.FC<PopupJadwalPemeliharaanProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [tanggal, setTanggal] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!tanggal) return alert("Harap pilih tanggal terlebih dahulu!");
    onSubmit(tanggal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">

        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Tambahkan Jadwal Pemeliharaan
        </h2>

        <div className="text-left mb-8">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Atur Jadwal
          </label>

          <div className="relative">
            <input
              ref={inputRef}
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* 🔥 CALENDAR IKON YANG MEMBUKA DATE PICKER */}
           
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition mr-2"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition ml-2"
          >
            Atur Jadwal
          </button>
        </div>

      </div>
    </div>
  );
};

export default PopupJadwalPemeliharaan;
