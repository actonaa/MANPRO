/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload, Search, ChevronDown } from "lucide-react";

export interface AsetFormData {
  namaAset: string;
  merkTipe: string;
  kodeBMD: string;
  tanggalPerolehan: string;
  divisi: string;
  dinas: string;
  department_id?: string;
  indukAset: string;
  lokasiAset: string;
  penanggungJawab: string;
  kategoriAset: string;
  subKategori: string;
  kondisi: string;
  useful_life: string;
  nilaiAset: string;
  vendor: string;
  kategoriAsetNama: string;
}

interface Step1Props {
  formData: AsetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AsetFormData>>;
  nextStep?: () => void;
  setUploadedFiles?: React.Dispatch<React.SetStateAction<File[] | null>>;
  uploadedFiles?: File[] | null;
  existingAttachmentName?: string | null;
}

export default function Step1({
  formData,
  setFormData,
  nextStep,
  setUploadedFiles,
  uploadedFiles,
}: Step1Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);

  const [searchInduk, setSearchInduk] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [allHR, setAllHR] = useState<any[]>([]);
  const [searchPJ, setSearchPJ] = useState("");
  const [showDropdownPJ, setShowDropdownPJ] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<any[]>([]);

  const indukRef = useRef<HTMLDivElement>(null);
  const pjRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");

  const CONDITIONS = {
    Baik: "fb67aff5-8a84-4ffd-bdf6-a1f25d7b6270",
    Ringan: "529392ea-6133-4243-8039-1e62f15c2066",
    Berat: "6e41ff82-91db-451d-88a5-1d93f9855060",
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch(
            "https://asset-risk-management.vercel.app/api/asset-categories",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://asset-risk-management.vercel.app/api/asset-subcategories",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setCategories(await catRes.json());
        setSubcategories(await subRes.json());
      } catch (error) {
        console.error("Gagal fetch kategori/subkategori:", error);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllAssets(await res.json());
      } catch (error) {
        console.error("Gagal fetch aset induk:", error);
      }
    }
    fetchAssets();
  }, [token]);

  useEffect(() => {
    async function fetchHR() {
      try {
        const res = await fetch(
          "https://sso-user-management.vercel.app/api/hr",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        const hrList = data.data || [];

        setAllHR(hrList); // ambil semua, tanpa filter department
      } catch (error) {
        console.error("Gagal fetch HR:", error);
      }
    }

    fetchHR();
  }, [token]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/assets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const all = await res.json();
        const aktif = all.filter((a: any) => a.status?.name === "Aktif");
        setAllAssets(aktif);
      } catch (error) {
        console.error("Gagal fetch aset induk:", error);
      }
    }
    fetchAssets();
  }, [token]);

  const selectedDepartmentName = departments.find(
    (d) => d.department_id === formData.department_id
  )?.department_name;

  const filteredHR = allHR.filter(
    (h) =>
      h.name?.toLowerCase().includes(searchPJ.toLowerCase()) &&
      h.department === selectedDepartmentName
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // validasi langsung
    if (!value || value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "Field ini wajib diisi" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === formData.kategoriAset
  );

  const filteredAssets = allAssets
    .filter((a) => {
      const statusName = a.status?.name;
      return statusName === "Aktif" || statusName === "Pemeliharaan";
    })
    .filter((a) =>
      formData.department_id ? a.department_id === formData.department_id : true
    )
    .filter((a) => a.name?.toLowerCase().includes(searchInduk.toLowerCase()));

  const requiredFields: (keyof AsetFormData)[] = [
    "namaAset",
    "merkTipe",
    "kodeBMD",
    "tanggalPerolehan",
    "lokasiAset",
    "penanggungJawab",
    "kategoriAset",
    "subKategori",
    "kondisi",
    "useful_life",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const value = formData[field];

      if (!value || value.toString().trim() === "") {
        newErrors[field] = "Field ini wajib diisi";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [divisions, setDivisions] = useState<any[]>([]);

  const [showDropdownDivisi, setShowDropdownDivisi] = useState(false);
  const divisiRef = useRef<HTMLDivElement>(null);

  const [showDropdownDinas, setShowDropdownDinas] = useState(false);
  const dinasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDivisionData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://sso-user-management.vercel.app/api/hierarchy/divisions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        setDivisions(json.data || []);
      } catch (error) {
        console.error("Gagal fetch division data:", error);
      }
    };

    fetchDivisionData();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://sso-user-management.vercel.app/api/master/departments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        setDepartments(json.data || []);
      } catch (error) {
        console.error("Gagal fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-xl font-semibold mb-4">
        Step 1 - Informasi Umum Aset
      </h2>

      {/* Nama Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Aset</label>
        <input
          type="text"
          name="namaAset"
          placeholder="Masukkan nama aset"
          value={formData.namaAset || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        {errors.namaAset && (
          <p className="text-sm text-red-500 mt-1">{errors.namaAset}</p>
        )}
      </div>

      {/* Merk */}
      <div>
        <label className="block text-sm font-medium mb-1">Merk/Tipe</label>
        <input
          type="text"
          name="merkTipe"
          placeholder="Masukkan merk atau tipe aset"
          value={formData.merkTipe || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        {errors.merkTipe && (
          <p className="text-sm text-red-500 mt-1">{errors.merkTipe}</p>
        )}
      </div>

      {/* Kode BMD */}
      <div>
        <label className="block text-sm font-medium mb-1">Kode BMD</label>
        <input
          type="text"
          name="kodeBMD"
          placeholder="Masukkan kode BMD"
          value={formData.kodeBMD || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        {errors.kodeBMD && (
          <p className="text-sm text-red-500 mt-1">{errors.kodeBMD}</p>
        )}
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tanggal Perolehan
        </label>
        <input
          type="date"
          name="tanggalPerolehan"
          value={formData.tanggalPerolehan || ""}
          onChange={handleChange}
          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        {errors.tanggalPerolehan && (
          <p className="text-sm text-red-500 mt-1">{errors.tanggalPerolehan}</p>
        )}
      </div>

      {/* Divisi */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Divisi</label>
        <div className="relative w-full" ref={divisiRef}>
          <div
            className="flex items-center justify-between border border-gray-300 px-3 py-2 rounded cursor-pointer"
            onClick={() => setShowDropdownDivisi(!showDropdownDivisi)}
          >
            <span className={formData.divisi ? "text-black" : "text-gray-400"}>
              {formData.divisi || "Pilih Divisi"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>

          {showDropdownDivisi && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
              {divisions.length > 0 ? (
                divisions.map((div: any, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        divisi: div.division_name,
                      }));
                      setShowDropdownDivisi(false);
                    }}
                  >
                    {div.division_name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dinas */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Dinas</label>
        <div className="relative w-full" ref={dinasRef}>
          <div
            className="flex items-center justify-between border border-gray-300 px-3 py-2 rounded cursor-pointer"
            onClick={() => setShowDropdownDinas(!showDropdownDinas)}
          >
            <span className={formData.dinas ? "text-black" : "text-gray-400"}>
              {formData.dinas || "Pilih Dinas"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>

          {showDropdownDinas && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <div
                    key={dept.department_id || dept.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        dinas: dept.department_name,
                        department_id: dept.department_id, // simpan ID juga
                        indukAset: "", // reset induk aset
                      }));
                      setShowDropdownDinas(false);
                    }}
                  >
                    {dept.department_name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Induk Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Induk Aset (Opsional)
        </label>

        <div className="relative" ref={indukRef}>
          <button
            type="button"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left bg-white flex justify-between items-center"
          >
            <span>
              {formData.indukAset
                ? allAssets.find((a) => a.id === formData.indukAset)?.name
                : "Pilih induk aset"}
            </span>

            <svg
              className={`w-4 h-4 transition-transform ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-56 overflow-hidden shadow-lg">
              <div className="flex items-center border-b border-b-gray-300 p-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Cari induk aset..."
                  value={searchInduk}
                  onChange={(e) => setSearchInduk(e.target.value)}
                  className="w-full outline-none py-1"
                  required
                />
              </div>

              <div className="max-h-48 overflow-y-auto">
                {filteredAssets.length === 0 && (
                  <div className="p-2 text-sm text-gray-500">
                    Tidak ditemukan
                  </div>
                )}

                {filteredAssets.map((a) => (
                  <div
                    key={a.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, indukAset: a.id }));
                      setShowDropdown(false);
                    }}
                  >
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lokasi */}
      <div>
        <label className="block text-sm font-medium mb-1">Lokasi Aset</label>
        <input
          type="text"
          name="lokasiAset"
          placeholder="Masukkan lokasi aset"
          value={formData.lokasiAset || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        {errors.lokasiAset && (
          <p className="text-sm text-red-500 mt-1">{errors.lokasiAset}</p>
        )}
      </div>

      {/* Penanggung Jawab */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Penanggung Jawab
        </label>

        <div className="relative" ref={pjRef}>
          <button
            type="button"
            onClick={() => setShowDropdownPJ((prev) => !prev)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left bg-white flex justify-between items-center"
          >
            <span>{formData.penanggungJawab || "Pilih penanggung jawab"}</span>

            <svg
              className={`w-4 h-4 transition-transform ${
                showDropdownPJ ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdownPJ && (
            <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-56 overflow-hidden shadow-lg">
              <div className="flex items-center border-b border-b-gray-300 p-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Cari penanggung jawab..."
                  value={searchPJ}
                  onChange={(e) => setSearchPJ(e.target.value)}
                  className="w-full outline-none py-1"
                  required
                />
              </div>

              <div className="max-h-48 overflow-y-auto">
                {filteredHR.length === 0 && (
                  <div className="p-2 text-sm text-gray-500">
                    Tidak ditemukan
                  </div>
                )}

                {filteredHR.map((hr) => (
                  <div
                    key={hr.hr_id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        penanggungJawab: hr.name,
                      }));
                      setShowDropdownPJ(false);
                    }}
                  >
                    {hr.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.penanggungJawab && (
          <p className="text-sm text-red-500 mt-1">{errors.penanggungJawab}</p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori Aset</label>
        <select
          name="kategoriAset"
          value={formData.kategoriAset || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedText = e.target.options[e.target.selectedIndex].text;

            setFormData((prev) => ({
              ...prev,
              kategoriAset: selectedId,
              kategoriAsetNama: selectedText.toLowerCase(),
              subKategori: "",
            }));
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        >
          <option value="">Pilih kategori aset</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.kategoriAset && (
          <p className="text-sm text-red-500 mt-1">{errors.kategoriAset}</p>
        )}
      </div>

      {/* Subkategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Sub Kategori</label>
        <select
          name="subKategori"
          value={formData.subKategori || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={!formData.kategoriAset}
          required
        >
          <option value="">Pilih sub kategori</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        {errors.subKategori && (
          <p className="text-sm text-red-500 mt-1">{errors.subKategori}</p>
        )}
      </div>

      {/* Kondisi */}
      <div>
        <label className="block text-sm font-medium mb-1 mt-4">
          Kondisi Aset
        </label>

        <div className="grid grid-cols-2 gap-4">
          {/* Kolom Kiri — Baik & Rusak */}
          <div className="space-y-2 border p-3 rounded-lg">
            {/* Baik */}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.kondisi === CONDITIONS.Baik}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    kondisi: CONDITIONS.Baik, // UUID Baik
                  }))
                }
              />
              Baik
            </label>

            {/* Pilih Rusak */}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={
                  formData.kondisi === CONDITIONS.Ringan ||
                  formData.kondisi === CONDITIONS.Berat
                }
                onChange={() =>
                  // Default ke "Ringan" saat user klik "Rusak"
                  setFormData((prev) => ({
                    ...prev,
                    kondisi: CONDITIONS.Ringan, // UUID Rusak Ringan
                  }))
                }
              />
              Rusak
            </label>
          </div>

          {/* Kolom Kanan — Pilih Ringan / Berat */}
          <div
            className={`space-y-2 border p-3 rounded-lg ${
              !(
                formData.kondisi === CONDITIONS.Ringan ||
                formData.kondisi === CONDITIONS.Berat
              )
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            {/* Rusak Ringan */}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.kondisi === CONDITIONS.Ringan}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    kondisi: CONDITIONS.Ringan, // UUID Rusak Ringan
                  }))
                }
              />
              Ringan
            </label>

            {/* Rusak Berat */}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.kondisi === CONDITIONS.Berat}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    kondisi: CONDITIONS.Berat, // UUID Rusak Berat
                  }))
                }
              />
              Berat
            </label>
          </div>
        </div>
      </div>

      {/* Masa Pakai */}
      <div>
        <label className="block text-sm font-medium mb-1">Masa Pakai</label>
        <input
          type="text"
          name="useful_life"
          placeholder="Masukkan masa pakai aset (hari/bulan/tahun)"
          value={formData.useful_life || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        {errors.useful_life && (
          <p className="text-sm text-red-500 mt-1">{errors.useful_life}</p>
        )}
      </div>

      {/* Nilai Aset */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Nilai Aset (Opsional)
        </label>
        <input
          type="number"
          name="nilaiAset"
          min={0}
          placeholder="Cth: 1000000"
          value={formData.nilaiAset || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Vendor */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Vendor (Opsional)
        </label>
        <input
          type="text"
          name="vendor"
          placeholder="Masukkan vendor aset"
          value={formData.vendor || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Upload */}
      <div className="flex flex-col mt-5">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Unggah Bukti (Opsional)
        </label>

        <div className="border-2 border-dashed rounded-lg p-10 text-center relative">
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={(e) =>
              setUploadedFiles?.(Array.from(e.target.files || []))
            }
          />

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5" />
            Unggah Dokumen
          </button>

          <p className="text-sm text-gray-500 mt-3">
            File ukuran kurang dari 1 MB
          </p>

          {uploadedFiles && uploadedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-700">
              {uploadedFiles.map((file) => file.name).join(", ")}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              nilaiAset: prev.nilaiAset?.trim() === "" ? "0" : prev.nilaiAset,
            }));

            if (validateForm()) {
              nextStep?.();
            }
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
