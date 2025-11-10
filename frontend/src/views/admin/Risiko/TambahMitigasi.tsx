import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LayoutDinas from "../../layout/LayoutDinas";

export default function TambahMitigasi() {
  const [probabilitas, setProbabilitas] = useState("");
  const [dampak, setDampak] = useState("");
  const [strategi, setStrategi] = useState("");
  const [biaya, setBiaya] = useState("");
  const [targetWaktu, setTargetWaktu] = useState("");
  const [efektivitas, setEfektivitas] = useState("");
  const [pemilik, setPemilik] = useState("");

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
          {/* Grid: 1 kolom di mobile/tablet, 2 kolom di desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* 🔹 Kolom gambar heatmap */}
            <div className="order-1 lg:order-2 flex items-center justify-center mb-4 lg:mb-0">
              <img
                src="/kelola-risiko/heatmap-risiko.png"
                alt="Heatmap Risiko"
                className="max-w-full rounded-lg border border-gray-200 shadow-sm"
              />
            </div>

            {/* 🔹 Kolom form */}
            <div className="order-2 lg:order-1 space-y-4 p-2">
              <h2 className="font-bold text-gray-700 mb-5">Langkah Mitigasi</h2>

              {/* Aksi Mitigasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aksi Mitigasi
                </label>
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
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:border-gray-400 ${
                      !probabilitas ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Turunkan Level Probabilitas
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
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
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:border-gray-400 ${
                      !dampak ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Turunkan Level Dampak
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Efektivitas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Efektivitas
                </label>
                <input
                  type="text"
                  placeholder="Cth: Tinggi / Sedang / Rendah"
                  value={efektivitas}
                  onChange={(e) => setEfektivitas(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Strategi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strategi
                </label>
                <div className="relative w-full">
                  <select
                    value={strategi}
                    onChange={(e) => setStrategi(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:border-gray-400 ${
                      !strategi ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Pilih Strategi
                    </option>
                    <option value="Avoid">Avoid</option>
                    <option value="Reduce">Reduce</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Accept">Accept</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Pemilik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pemilik
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama pemilik mitigasi"
                  value={pemilik}
                  onChange={(e) => setPemilik(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Perkiraan Biaya */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perkiraan Biaya
                </label>
                <input
                  type="text"
                  placeholder="Cth: Rp 10.000.000"
                  value={biaya}
                  onChange={(e) => setBiaya(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Target Waktu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Waktu
                </label>
                <input
                  type="date"
                  value={targetWaktu}
                  onChange={(e) => setTargetWaktu(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* 🔘 Tombol Aksi */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-16">
            <button className="w-full lg:w-1/2 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 transition">
              Batal
            </button>
            <button className="w-full lg:w-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 rounded-lg transition">
              Tambah
            </button>
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}
