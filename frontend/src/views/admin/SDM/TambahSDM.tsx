/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { UploadCloud, ChevronDown, Plus } from "lucide-react";

interface SDMFormData {
  nama: string;
  alamat: string;
  noTelepon: string;
  nip: string;
  dinas: string;
  divisi: string;
  seksi: string;
  jabatan: string;
  hakAkses: string;
  keahlian: string;
  sertifikasiFiles: File[];
  periodeMulai: string;
  periodeSelesai: string;
}

export default function TambahSDM() {
  const [form, setForm] = useState<SDMFormData>({
    nama: "",
    alamat: "",
    noTelepon: "",
    nip: "",
    dinas: "",
    divisi: "",
    seksi: "",
    jabatan: "",
    hakAkses: "",
    keahlian: "",
    sertifikasiFiles: [],
    periodeMulai: "",
    periodeSelesai: "",
  });

  // ================================
  //      DATA MASTER DARI API
  // ================================
  const [departments, setDepartments] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMaster = async () => {
      try {
        const [deptRes, divRes, secRes, posRes, roleRes] = await Promise.all([
          fetch(
            "https://sso-user-management.vercel.app/api/master/departments",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://sso-user-management.vercel.app/api/hierarchy/divisions",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://sso-user-management.vercel.app/api/hierarchy/sections",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch("https://sso-user-management.vercel.app/api/master/positions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://sso-user-management.vercel.app/api/master/roles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const deptData = await deptRes.json();
        const divData = await divRes.json();
        const secData = await secRes.json();
        const posData = await posRes.json();
        const roleData = await roleRes.json();

        setDepartments(deptData.data || []);
        setDivisions(divData.data || []);
        setSections(secData.data || []);
        setPositions(posData.data || []);
        setRoles(roleData.data || []);
      } catch (err) {
        console.error("Gagal fetch master data:", err);
      }
    };

    fetchMaster();
  }, []);

  // =======================
  //     FILTER DROPDOWN
  // =======================
  const filteredDivisions = divisions.filter(
    (d) => d.department_id === form.dinas
  );

  const filteredSections = sections.filter(
    (s) => s.division_id === form.divisi
  );

  // =======================
  //     HANDLE FORM
  // =======================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, sertifikasiFiles: files }));
  };

  // ================================
  //           HANDLE SUBMIT
  // ================================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan!");
      return;
    }

    const payload = {
      nip: form.nip,
      name: form.nama,
      contract_start_date: form.periodeMulai,
      contract_end_date: form.periodeSelesai,

      department_id: form.dinas,
      division_id: form.divisi,
      section_id: form.seksi,
      position_id: form.jabatan,
      role_id: form.hakAkses,

      skills: form.keahlian.split(",").map((skill, index) => ({
        skill_id: skill.trim(),
        file_index: form.sertifikasiFiles[index] ? index : null,
      })),
    };

    try {
      const res = await fetch("https://sso-user-management.vercel.app/api/hr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Gagal menyimpan data SDM");
        return;
      }

      alert("Data SDM berhasil disimpan!");
      console.log("Response:", data);
    } catch (error) {
      console.error("Error posting:", error);
      alert("Terjadi kesalahan jaringan");
    }
  };

  // ===================================================================
  //                              UI FORM
  // ===================================================================

  const selectClass =
    "w-full border border-gray-300 rounded-xl px-3 py-2.5 pr-10 text-sm appearance-none";

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-semibold mb-4">
          Formulir Penambahan Sumber Daya Manusia
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8"
        >
          <div className="space-y-5">
            {/* ================= NAMA ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Nama SDM</p>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama SDM"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
              />
            </div>

            {/* ================= ALAMAT ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Alamat</p>
              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan Alamat"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
              />
            </div>

            {/* ================= NO TELEPON ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">No. Telepon</p>
              <input
                type="tel"
                name="noTelepon"
                value={form.noTelepon}
                onChange={handleChange}
                placeholder="Masukkan No. Telepon"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
              />
            </div>

            {/* ================= NIP ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">NIP</p>
              <input
                type="text"
                name="nip"
                value={form.nip}
                onChange={handleChange}
                placeholder="Masukkan NIP"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
              />
            </div>

            {/* ================= DINAS ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Dinas</p>
              <div className="relative">
                <select
                  name="dinas"
                  value={form.dinas}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Pilih Dinas</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* ================= DIVISI ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Divisi</p>
              <div className="relative">
                <select
                  name="divisi"
                  value={form.divisi}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Pilih Divisi</option>
                  {filteredDivisions.map((d) => (
                    <option key={d.division_id} value={d.division_id}>
                      {d.division_name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* ================= SEKSI ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Seksi</p>
              <div className="relative">
                <select
                  name="seksi"
                  value={form.seksi}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Pilih Seksi</option>
                  {filteredSections.map((s) => (
                    <option key={s.section_id} value={s.section_id}>
                      {s.section_name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* ================= JABATAN ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Jabatan</p>
              <div className="relative">
                <select
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Pilih Jabatan</option>
                  {positions.map((p) => (
                    <option key={p.position_id} value={p.position_id}>
                      {p.position_name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* ================= HAK AKSES ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Hak Akses Sistem</p>
              <div className="relative">
                <select
                  name="hakAkses"
                  value={form.hakAkses}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Pilih Hak Akses</option>
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      {r.role_name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* ================= KEAHLIAN ================= */}
            <div>
              <p className="text-sm font-semibold mb-1">Keahlian</p>
              <input
                type="text"
                name="keahlian"
                value={form.keahlian}
                onChange={handleChange}
                placeholder="Contoh: uuid-skill-1, uuid-skill-2"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* ================= SERTIFIKASI ================= */}
          <div className="mt-10">
            <p className="text-sm font-semibold mb-3">Sertifikasi</p>

            <div className="border border-dashed border-gray-300 rounded-2xl bg-gray-50/70 px-4 py-6 md:px-8 text-center">
              <label className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-sm">
                <UploadCloud className="w-4 h-4" />
                Unggah Dokumen
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {form.sertifikasiFiles.length > 0 && (
                <ul className="mt-4 text-xs space-y-1">
                  {form.sertifikasiFiles.map((file, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <Plus className="w-3 h-3 mr-1" /> {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ================= PERIODE KERJA ================= */}
          <div className="mt-10">
            <p className="text-sm font-semibold mb-2">Periode Kerja</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="date"
                name="periodeMulai"
                value={form.periodeMulai}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm"
              />

              <input
                type="date"
                name="periodeSelesai"
                value={form.periodeSelesai}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm"
              />
            </div>
          </div>

          {/* ================= SUBMIT ================= */}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 bg-[#0A84FF] hover:bg-[#006FE0] text-white font-semibold text-sm rounded-[18px]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
