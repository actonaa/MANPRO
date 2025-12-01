import React, { useState, useRef } from "react";
import { Calendar } from "lucide-react";

interface PopupJadwalPemeliharaanProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    scheduled_date: string,
    priority: string,
    setPopupLoading: (state: boolean) => void
  ) => void;
}

const PopupJadwalPemeliharaan: React.FC<PopupJadwalPemeliharaanProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [tanggal, setTanggal] = useState("");
  const [priority, setPriority] = useState(""); // kosong, user harus pilih
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!tanggal) return alert("Harap pilih tanggal terlebih dahulu!");
    if (!priority) return alert("Harap pilih prioritas terlebih dahulu!");
    onSubmit(tanggal, priority, setLoading);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Tambahkan Jadwal Pemeliharaan
        </h2>

        {/* Input Tanggal */}
        <div className="text-left mb-4">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Atur Jadwal
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Calendar
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => inputRef.current?.showPicker?.()}
            />
          </div>
        </div>

        {/* Dropdown Priority */}
        <div className="text-left mb-8">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Prioritas
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              Pilih Prioritas
            </option>
            <option value="tinggi">Tinggi</option>
            <option value="sedang">Sedang</option>
            <option value="rendah">Rendah</option>
          </select>
        </div>

        {/* Buttons */}
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
            {loading ? "Memproses..." : "Atur Jadwal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupJadwalPemeliharaan;
