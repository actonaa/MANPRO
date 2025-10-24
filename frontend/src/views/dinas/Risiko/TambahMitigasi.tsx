import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LayoutDinas from "../../layout/LayoutDinas";

export default function TambahMitigasi() {
  const [probabilitas, setProbabilitas] = useState("");
  const [dampak, setDampak] = useState("");
  const [efektivitas, setEfektivitas] = useState("");

  return (
    <LayoutDinas>
      <div>
        {/* 🧭 Judul & Deskripsi */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Tambah Mitigasi
          </h1>
          <p className="text-sm text-gray-500">
            Ikuti langkah-langkah di bawah ini untuk menambahkan mitigasi risiko
            baru.
          </p>
        </div>

        {/* 🔲 Card Utama */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* 🔹 Kolom kanan (gambar heatmap) */}
            <div className="order-1 md:order-2 flex items-center justify-center">
              <img
                src="/kelola-risiko/heatmap-risiko.png"
                alt="Heatmap Risiko"
                className="max-w-full rounded-lg border border-gray-200"
              />
            </div>

            {/* 🔹 Kolom kiri (form) */}
            <div className="order-2 md:order-1 space-y-4 p-2">
              <h2 className="font-bold text-gray-700 mb-5">Langkah Mitigasi</h2>
              {/* Langkah Mitigasi */}
              <div>
                <h2 className="font-medium text-gray-700 mb-2">
                  Aksi Mitigasi
                </h2>
                <textarea
                  placeholder="Cth: downtime > 2 jam, layanan publik terganggu, biaya > Rp 10 jt..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400 resize-none"
                  rows={3}
                />
              </div>

              {/* Probabilitas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probabilitas
                </label>
                <div className="relative w-full">
                  <select
                    value={probabilitas}
                    onChange={(e) => setProbabilitas(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none outline-none focus:outline-none focus:border-gray-400 ${
                      !probabilitas ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Turunkan Level Probabilitas
                    </option>
                    <option value="1">1 - Jarang</option>
                    <option value="2">2 - Kemungkinan kecil</option>
                    <option value="3">3 - Sedang</option>
                    <option value="4">4 - Besar</option>
                    <option value="5">5 - Hampir pasti</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Dampak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dampak
                </label>
                <div className="relative w-full">
                  <select
                    value={dampak}
                    onChange={(e) => setDampak(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none outline-none focus:outline-none focus:border-gray-400 ${
                      !dampak ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Turunkan Level Dampak
                    </option>
                    <option value="1">1 - Sangat rendah</option>
                    <option value="2">2 - Rendah</option>
                    <option value="3">3 - Sedang</option>
                    <option value="4">4 - Tinggi</option>
                    <option value="5">5 - Sangat tinggi</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Efektivitas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Efektivitas
                </label>
                <div className="relative w-full">
                  <select
                    value={efektivitas}
                    onChange={(e) => setEfektivitas(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none outline-none focus:outline-none focus:border-gray-400 ${
                      !efektivitas ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Rendah / Sedang / Tinggi
                    </option>
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* 🔘 Tombol Aksi */}
          <div className="flex flex-row md:flex-row justify-between items-center gap-4 mt-20">
            <button className="w-full md:w-1/2 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 transition">
              Batal
            </button>
            <button className="w-full md:w-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 rounded-lg transition">
              Tambah
            </button>
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}
