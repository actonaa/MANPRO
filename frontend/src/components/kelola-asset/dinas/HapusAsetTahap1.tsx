import React, { useState } from "react";
import { X } from "lucide-react";

interface HapusAsetTahap1Props {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  setReason: React.Dispatch<React.SetStateAction<string>>;

  assetName: string;
  kategori: string;
  merk: string;
  subKategori: string;
  lokasi: string;
  tglPerolehan: string;
  penanggungJawab: string;
  kondisi: string;
  biaya: string;
  kodeBMD: string;
  namaDinas: string;
}

const HapusAsetTahap1: React.FC<HapusAsetTahap1Props> = ({
  open,
  onClose,
  onNext,
  setReason,
  assetName,
  kategori,
  merk,
  subKategori,
  lokasi,
  tglPerolehan,
  penanggungJawab,
  kondisi,
  biaya,
  kodeBMD,
  namaDinas,
}) => {
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleNext = () => {
    if (!alasan.trim()) {
      setError("Alasan penghapusan wajib diisi");
      return;
    }

    setError("");
    setReason(alasan); // kirim ke parent
    onNext(); // lanjut ke tahap 2
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex justify-center items-center px-4">
      <div className="bg-white w-[400px] rounded-xl shadow-md p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Hapus {assetName}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="font-semibold text-gray-700 mb-3">Informasi Utama</p>

        {/* Grid Info */}
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <div>
            <p className="text-gray-500">Nama Aset</p>
            <p className="font-medium">{assetName}</p>
          </div>

          <div>
            <p className="text-gray-500">Kategori Aset</p>
            <p className="font-medium">{kategori}</p>
          </div>

          <div>
            <p className="text-gray-500">Merk/Tipe Aset</p>
            <p className="font-medium">{merk}</p>
          </div>

          <div>
            <p className="text-gray-500">Sub Kategori</p>
            <p className="font-medium">{subKategori}</p>
          </div>

          <div>
            <p className="text-gray-500">Lokasi Aset</p>
            <p className="font-medium">{lokasi}</p>
          </div>

          <div>
            <p className="text-gray-500">Tgl. Perolehan Aset</p>
            <p className="font-medium">{tglPerolehan}</p>
          </div>

          <div>
            <p className="text-gray-500">Penanggung Jawab</p>
            <p className="font-medium">{penanggungJawab}</p>
          </div>

          <div>
            <p className="text-gray-500">Kondisi Aset</p>
            <p className="font-medium">{kondisi}</p>
          </div>

          <div>
            <p className="text-gray-500">Kode BMD</p>
            <p className="font-medium">{kodeBMD}</p>
          </div>

          <div>
            <p className="text-gray-500">Biaya Aset</p>
            <p className="font-medium">{biaya}</p>
          </div>

          <div>
            <p className="text-gray-500">Nama Dinas</p>
            <p className="font-medium">{namaDinas}</p>
          </div>
        </div>

        {/* Alasan */}
        <p className="text-gray-700 font-medium mb-1">Alasan</p>
        <textarea
          value={alasan}
          onChange={(e) => {
            setAlasan(e.target.value);
            setError("");
          }}
          placeholder="Ketik Alasan"
          className={`w-full border rounded-lg p-2 text-sm mb-1 ${
            error ? "border-red-500" : ""
          }`}
          rows={3}
        />

        {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

        <button
          className="w-full bg-red-600 text-white py-2 rounded-lg mb-2 font-medium"
          onClick={handleNext}
        >
          Hapus
        </button>

        <button
          className="w-full border py-2 rounded-lg font-medium"
          onClick={onClose}
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default HapusAsetTahap1;
