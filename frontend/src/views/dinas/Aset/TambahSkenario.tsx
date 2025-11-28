/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";

interface SDMFormData {
  nama: string;
  alamat: string;
  nip: string;
  assets: string[]; // array dinamis
}

export default function TambahSkenario() {
  const [form, setForm] = useState<SDMFormData>({
    nama: "",
    alamat: "",
    nip: "",
    assets: [""], // mulai dengan 1 inputan
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dynamic asset change
  const handleAssetChange = (index: number, value: string) => {
    const newAssets = [...form.assets];
    newAssets[index] = value;
    setForm((prev) => ({ ...prev, assets: newAssets }));
  };

  // Add new asset input
  const addAssetField = () => {
    setForm((prev) => ({ ...prev, assets: [...prev.assets, ""] }));
  };

  // Remove asset input
  const removeAssetField = (index: number) => {
    const newAssets = form.assets.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, assets: newAssets }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // ambil token

    const payload = {
      name: form.nama,
      description: form.alamat,
      owner_position_id: form.nip,
      asset_ids: form.assets.filter((v) => v.trim() !== ""), // hapus input kosong
    };

    try {
      const response = await axios.post(
        "https://asset-risk-management.vercel.app/api/scenarios",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Berhasil:", response.data);
      alert("Data skenario berhasil disimpan!");
    } catch (error: any) {
      console.error("Error:", error.response?.data || error);
      alert("Gagal menyimpan data!");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">
        Formulir Penambahan Skenario
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8"
      >
        <div className="space-y-5">
          {/* NAMA */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Nama Skenario
            </p>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama Skenario"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Deskripsi
            </p>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Masukkan deskripsi skenario"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm h-24 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* OWNER POSITION */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Posisi Jabatan
            </p>
            <input
              type="text"
              name="nip"
              value={form.nip}
              onChange={handleChange}
              placeholder="Masukkan posisi jabatan"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* ASSET DINAMIS */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Asset</p>

            {form.assets.map((value, index) => (
              <div key={index} className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleAssetChange(index, e.target.value)}
                  placeholder="Pilih aset yang berhubungan dengan skenario"
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />

                {/* Remove button */}
                {form.assets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAssetField(index)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Add button */}
            <button
              type="button"
              onClick={addAssetField}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-sm mt-1"
            >
              <Plus className="w-4 h-4" /> Tambah Asset
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            className="px-10 py-3 bg-[#0A84FF] hover:bg-[#006FE0] 
            text-white font-semibold text-sm rounded-[18px] shadow-sm"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
