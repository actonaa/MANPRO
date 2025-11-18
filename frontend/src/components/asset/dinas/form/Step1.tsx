/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from "react";
import { Upload, Search } from "lucide-react";

export interface AsetFormData {
  namaAset: string;
  merkTipe: string;
  kodeBMD: string;
  tanggalPerolehan: string;
  indukAset: string;
  lokasiAset: string;
  penanggungJawab: string;
  kategoriAset: string;
  subKategori: string;
  kondisi: string;
  masaPakai: string;
  nilaiAset: string;
  vendor: string;
  kategoriAsetNama: string;
}

interface Step1Props {
  formData: AsetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AsetFormData>>;
  nextStep?: () => void;
}

export default function Step1({ formData, setFormData, nextStep }: Step1Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);

  // Search induk aset
  const [searchInduk, setSearchInduk] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem("token");

  // === FIX: UUID KONDISI ===
  const CONDITIONS = {
    Baik: "fb67aff5-8a84-4ffd-bdf6-a1f25d7b6270",
    Ringan: "529392ea-6133-4243-8039-1e62f15c2066",
    Berat: "6e41ff82-91db-451d-88a5-1d93f9855060",
  };

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

  // Input handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setKondisi = (label: "Baik" | "Ringan" | "Berat") => {
    setFormData((prev) => ({
      ...prev,
      kondisi: CONDITIONS[label],
    }));
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === formData.kategoriAset
  );

  const isBaik = formData.kondisi === CONDITIONS.Baik;
  const isRingan = formData.kondisi === CONDITIONS.Ringan;
  const isBerat = formData.kondisi === CONDITIONS.Berat;
  const isRusak = isRingan || isBerat || formData.kondisi === "";

  // Filter induk aset
  const filteredAssets = allAssets.filter((a) =>
    a.name?.toLowerCase().includes(searchInduk.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-xl font-semibold mb-4">
        Step 1 - Informasi Umum Aset
      </h2>

      {/* NAMA ASET */}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Aset</label>
        <input
          type="text"
          name="namaAset"
          value={formData.namaAset}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Merk */}
      <div>
        <label className="block text-sm font-medium mb-1">Merk/Tipe</label>
        <input
          type="text"
          name="merkTipe"
          value={formData.merkTipe}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Kode BMD */}
      <div>
        <label className="block text-sm font-medium mb-1">Kode BMD</label>
        <input
          type="text"
          name="kodeBMD"
          value={formData.kodeBMD}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tanggal Perolehan
        </label>
        <input
          type="date"
          name="tanggalPerolehan"
          value={formData.tanggalPerolehan}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* ======================= INDUK ASET CUSTOM DROPDOWN ======================= */}
      <div>
        <label className="block text-sm font-medium mb-1">Induk Aset</label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left bg-white flex justify-between items-center"
          >
            <span>
              {formData.indukAset
                ? allAssets.find((a) => a.id === formData.indukAset)?.name
                : "Pilih Induk Aset"}
            </span>

            {/* Panah Bawah */}
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
              {/* Search */}
              <div className="flex items-center border-b border-b-gray-300 p-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Cari induk aset..."
                  value={searchInduk}
                  onChange={(e) => setSearchInduk(e.target.value)}
                  className="w-full outline-none py-1"
                />
              </div>

              {/* List */}
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
          value={formData.lokasiAset}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Penanggung Jawab */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Penanggung Jawab
        </label>
        <input
          type="text"
          name="penanggungJawab"
          value={formData.penanggungJawab}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori Aset</label>
        <select
          name="kategoriAset"
          value={formData.kategoriAset}
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
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* SubKategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Sub Kategori</label>
        <select
          name="subKategori"
          value={formData.subKategori}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={!formData.kategoriAset}
        >
          <option value="">Pilih Sub Kategori</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kondisi */}
      <div>
        <label className="block text-sm font-medium mb-1 mt-4">
          Kondisi Aset
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 border p-3 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isBaik}
                onChange={() => setKondisi("Baik")}
              />
              Baik
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isRusak}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, kondisi: "" }))
                }
              />
              Rusak
            </label>
          </div>

          <div
            className={`space-y-2 border p-3 rounded-lg ${
              !isRusak ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isRingan}
                onChange={() => setKondisi("Ringan")}
              />
              Ringan
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isBerat}
                onChange={() => setKondisi("Berat")}
              />
              Berat
            </label>
          </div>
        </div>
      </div>

      {/* Masa Pakai */}
      <div>
        <label className="block text-sm font-medium mb-1 mt-4">
          Masa Pakai
        </label>
        <input
          type="text"
          name="masaPakai"
          value={formData.masaPakai}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Nilai Aset */}
      <div>
        <label className="block text-sm font-medium mb-1 mt-4">
          Nilai Aset (Opsional)
        </label>
        <input
          type="number"
          name="nilaiAset"
          value={formData.nilaiAset}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Vendor */}
      <div>
        <label className="block text-sm font-medium mb-1 mt-4">Vendor</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Upload */}
      <div className="flex flex-col mt-5">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Unggah Bukti (Opsional)
        </label>
        <div className="border-2 border-dashed rounded-lg p-10 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
          >
            <Upload className="w-5 h-5" />
            Unggah Dokumen
          </button>
          <p className="text-sm text-gray-500 mt-3">
            File ukuran kurang dari 1 MB
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
