import { useState } from "react";
import { RotateCcw, ArrowLeft } from "lucide-react";
import ButtonFilter from "../../components/button/ButtonFilter";

export default function EditPengguna() {
  const [isActive, setIsActive] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    dinas: "",
    email: "",
    peran: "",
    password: "",
  });

  const handleGeneratePassword = () => {
    const randomPass = Math.random().toString(36).slice(-8);
    setForm((prev) => ({ ...prev, password: randomPass }));
  };

  const dinasOptions = [
    "Dinas Kesehatan",
    "Dinas Pendidikan",
    "Dinas Kebudayaan",
    "Dinas Kepemudaan dan Olahraga",
    "Dinas Sosial",
    "Dinas Perhubungan",
    "Dinas Perindustrian dan Perdagangan",
    "Dinas Komunikasi dan Informatika",
    "Dinas Pekerjaan Umum dan Penataan Ruang",
    "Dinas Koperasi dan UKM",
    "Dinas Lingkungan Hidup",
  ];
  const peranOptions = ["Admin", "Verifikator", "User"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header di luar card */}
      <div className="flex items-start gap-3 px-6 md:px-2 mt-8">
        <button
          onClick={() => window.history.back()}
          className="text-gray-700 hover:text-gray-900 mt-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900">
            Tambah Pengguna
          </h1>
          <p className="text-gray-500 text-sm">
            Ubah data berikut untuk memperbarui data pengguna.
          </p>
        </div>
      </div>

      {/* Card form */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 max-w-6xl mx-auto w-full mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Pengguna */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nama Pengguna
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Masukkan Nama Pengguna"
              value={form.nama}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Dinas Dropdown */}
          <div className="[&_.text-sm]:font-normal">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Dinas
            </label>
            <ButtonFilter
              label={form.dinas || "Pilih Dinas"}
              options={dinasOptions}
              onSelect={(val) => setForm((prev) => ({ ...prev, dinas: val }))}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan Email Pengguna"
              value={form.email}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Peran Dropdown */}
          <div className="[&_.text-sm]:font-normal">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Peran
            </label>
            <ButtonFilter
              label={form.peran || "Pilih Peran"}
              options={peranOptions}
              onSelect={(val) => setForm((prev) => ({ ...prev, peran: val }))}
            />
          </div>

          {/* Kata Sandi */}
          <div className="relative md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Kata Sandi
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg pr-3">
              <input
                type="text"
                name="password"
                placeholder="Masukkan Kata Sandi"
                value={form.password}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[#007DFA] hover:text-blue-700 transition"
              >
                <RotateCcw className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Status
            </label>
            <div className="flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3">
              <div>
                <p className="font-medium text-gray-800">Akun Pengguna</p>
                <p className="text-sm text-gray-500">
                  Atur akun pengguna ke aktif / non-aktif
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                  isActive ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                    isActive ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="mt-8">
          <button className="bg-[#007DFA] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
