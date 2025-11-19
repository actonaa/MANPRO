import { useState, type ChangeEvent, type FormEvent } from "react";
import { UploadCloud, ChevronDown, Plus } from "lucide-react";

interface SDMFormData {
  nama: string;
  alamat: string;
  noTelepon: string;
  nip: string;
  dinas: string;
  divisi: string;
  jabatan: string;
  seksi: string;
  hakAkses: string;
  keahlian: string;
  sertifikasiFiles: File[];
  periodeMulai: string;
  periodeSelesai: string;
}

export default function EditSDM() {
  const [form, setForm] = useState<SDMFormData>({
    nama: "",
    alamat: "",
    noTelepon: "",
    nip: "",
    dinas: "",
    divisi: "",
    jabatan: "",
    seksi: "",
    hakAkses: "",
    keahlian: "",
    sertifikasiFiles: [],
    periodeMulai: "",
    periodeSelesai: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, sertifikasiFiles: files }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Data SDM berhasil diedit:", form);
    alert("Perubahan berhasil disimpan (dummy)");
  };

  // Static dropdown options
  const dinasOptions = [
    "DISKOMINFO",
    "DISPENDIK",
    "Dinas Kesehatan",
    "Dinas Kependudukan",
    "Sekretariat Daerah",
  ];

  const divisiOptions = [
    "Departemen Teknologi Informasi",
    "Departemen Keuangan",
    "Departemen Umum",
  ];

  const jabatanOptions = [
    "Kepala Departemen",
    "Supervisor",
    "Staff",
    "Admin Sistem",
  ];

  const seksiOptions = ["Seksi 1", "Seksi 2", "Seksi 3"];

  const aksesOptions = ["Admin", "User", "Viewer"];

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-semibold mb-4">
          Edit Sumber Daya Manusia
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8"
        >
          {/* ============================= */}
          {/*        FORM FIELDS           */}
          {/* ============================= */}
          <div className="space-y-5">
            {/* NAMA SDM */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Nama SDM
              </p>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama SDM"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* ALAMAT */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Alamat</p>
              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan Nama Alamat"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* NO TELEPON */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                No. Telepon
              </p>
              <input
                type="tel"
                name="noTelepon"
                value={form.noTelepon}
                onChange={handleChange}
                placeholder="Masukkan No. Telepon"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* NIP */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">NIP</p>
              <input
                type="text"
                name="nip"
                value={form.nip}
                onChange={handleChange}
                placeholder="Masukkan NIP"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* DROPDOWNS */}
            <Dropdown
              label="Dinas"
              name="dinas"
              value={form.dinas}
              options={dinasOptions}
              onChange={handleChange}
            />
            <Dropdown
              label="Divisi"
              name="divisi"
              value={form.divisi}
              options={divisiOptions}
              onChange={handleChange}
            />
            <Dropdown
              label="Jabatan"
              name="jabatan"
              value={form.jabatan}
              options={jabatanOptions}
              onChange={handleChange}
            />
            <Dropdown
              label="Seksi"
              name="seksi"
              value={form.seksi}
              options={seksiOptions}
              onChange={handleChange}
            />
            <Dropdown
              label="Hak Akses Sistem"
              name="hakAkses"
              value={form.hakAkses}
              options={aksesOptions}
              onChange={handleChange}
            />

            {/* KEAHLIAN */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Keahlian
              </p>
              <input
                type="text"
                name="keahlian"
                value={form.keahlian}
                onChange={handleChange}
                placeholder="Masukkan sertifikasi / keahlian"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* ============================= */}
          {/*          SERTIFIKASI          */}
          {/* ============================= */}
          <div className="mt-10">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Sertifikasi
            </p>

            <div className="border border-dashed border-gray-300 rounded-2xl bg-gray-50/70 px-4 py-6 md:px-8 md:py-8 text-center">
              <label className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100">
                <UploadCloud className="w-4 h-4" />
                Unggah Dokumen
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <p className="mt-2 text-[11px] text-gray-500">
                File ukuran maks 1MB
              </p>

              {form.sertifikasiFiles.length > 0 && (
                <ul className="mt-4 text-xs text-gray-600 space-y-1">
                  {form.sertifikasiFiles.map((file, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <Plus className="w-3 h-3 mr-1 text-gray-400" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ============================= */}
          {/*        PERIODE KERJA          */}
          {/* ============================= */}
          <div className="mt-10">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Periode Kerja
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <div className="flex-1">
                <input
                  type="date"
                  name="periodeMulai"
                  value={form.periodeMulai}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="flex-1">
                <input
                  type="date"
                  name="periodeSelesai"
                  value={form.periodeSelesai}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ============================= */}
          {/*          SUBMIT BUTTON        */}
          {/* ============================= */}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 bg-[#0A84FF] hover:bg-[#006FE0] text-white font-semibold text-sm rounded-[18px] shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================= */
/*        REUSABLE DROPDOWN      */
/* ============================= */
function Dropdown({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: any;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Pilih {label}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
