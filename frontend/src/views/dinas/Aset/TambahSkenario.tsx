/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ChevronDown, ChevronUp, Search, Plus, Trash2 } from "lucide-react";
import axios from "axios";

interface SDMFormData {
  nama: string;
  alamat: string;
  nip: string;
  assets: string[];
}

interface PositionItem {
  position_id: string;
  position_name: string;
}

export default function TambahSkenario() {
  const [form, setForm] = useState<SDMFormData>({
    nama: "",
    alamat: "",
    nip: "",
    assets: [""],
  });

  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchPosisi, setSearchPosisi] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // === CLICK OUTSIDE UNTUK CLOSE DROPDOWN ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === FETCH POSISI JABATAN ===
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get<any>(
          "https://sso-user-management.vercel.app/api/master/positions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPositions(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil posisi jabatan:", error);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetChange = (index: number, value: string) => {
    const newAssets = [...form.assets];
    newAssets[index] = value;
    setForm((prev) => ({ ...prev, assets: newAssets }));
  };

  const addAssetField = () => {
    setForm((prev) => ({ ...prev, assets: [...prev.assets, ""] }));
  };

  const removeAssetField = (index: number) => {
    const newAssets = form.assets.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, assets: newAssets }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      name: form.nama,
      description: form.alamat,
      owner_position_id: form.nip,
      asset_ids: form.assets.filter((v) => v.trim() !== ""),
    };

    try {
      const response = await axios.post(
        "https://asset-risk-management.vercel.app/api/scenarios",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Berhasil:", response.data);
      alert("Data skenario berhasil disimpan!");
    } catch (error: any) {
      console.error("Error:", error.response?.data || error);
      alert("Gagal menyimpan data!");
    }
  };

  // Filter posisi
  const filteredPositions = positions.filter((pos) =>
    pos.position_name.toLowerCase().includes(searchPosisi.toLowerCase())
  );

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
          {/* === NAMA === */}
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

          {/* === DESKRIPSI === */}
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

          {/* === POSISI JABATAN SEARCH DROPDOWN === */}
          <div className="relative" ref={dropdownRef}>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Posisi Jabatan
            </p>

            <div
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white cursor-pointer flex justify-between items-center"
            >
              <span>
                {form.nip
                  ? positions.find((p) => p.position_id === form.nip)
                      ?.position_name
                  : "Pilih posisi jabatan..."}
              </span>

              {openDropdown ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>

            {openDropdown && (
              <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl mt-1 shadow-lg max-h-64 overflow-auto">
                {/* Search Box */}
                <div className="flex items-center px-3 border-b border-gray-200 bg-gray-50">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchPosisi}
                    onChange={(e) => setSearchPosisi(e.target.value)}
                    className="w-full px-2 py-2 text-sm bg-gray-50 outline-none"
                    placeholder="Cari posisi..."
                  />
                </div>

                {/* List Hasil */}
                {filteredPositions.map((pos) => (
                  <div
                    key={pos.position_id}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, nip: pos.position_id }));
                      setOpenDropdown(false);
                      setSearchPosisi("");
                    }}
                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                  >
                    {pos.position_name}
                  </div>
                ))}

                {filteredPositions.length === 0 && (
                  <p className="px-3 py-2 text-gray-400 text-sm">
                    Tidak ditemukan
                  </p>
                )}
              </div>
            )}
          </div>

          {/* === ASSET === */}
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

            <button
              type="button"
              onClick={addAssetField}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-sm mt-1"
            >
              <Plus className="w-4 h-4" /> Tambah Asset
            </button>
          </div>
        </div>

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
