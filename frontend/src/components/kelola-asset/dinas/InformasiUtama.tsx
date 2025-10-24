import React from "react";
import StatusBadge from "../../status/StatusBadge";

interface InformasiUtamaProps {
  merk: string;
  penanggungJawab: string;
  status: "Aktif" | "Perbaikan" | "Tidak Aktif";
  nomorSerial: string;
  kategori: string;
  subKategori: string;
  nilaiAset: string;
  kodeBMD: string;
  lokasi: string;
  tanggalPerolehan: string;
  kondisi: string;
  version: string;
  os: string;
  ipAddress: string;
  hostname: string;
}

const InformasiUtama: React.FC<InformasiUtamaProps> = ({
  merk,
  penanggungJawab,
  status,
  nomorSerial,
  kategori,
  subKategori,
  nilaiAset,
  kodeBMD,
  lokasi,
  tanggalPerolehan,
  kondisi,
  version,
  os,
  ipAddress,
  hostname,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full border border-gray-200">
      {/* 🔹 Header Judul + Status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg text-gray-900">Informasi Utama</h2>

        {/* Status di sisi kanan */}
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-gray-900">Status</p>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* 🔹 Grid utama: 3 kolom berisi informasi aset */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm">
        {/* 🟩 Kolom 1 */}
        <div>
          <p className="font-semibold text-gray-900">Merk / Tipe</p>
          <p className="text-gray-600">{merk}</p>
        </div>

        {/* 🟩 Kolom 2 */}
        <div>
          <p className="font-semibold text-gray-900">Penanggung Jawab</p>
          <p className="text-gray-600">{penanggungJawab}</p>
        </div>

        {/* 🟩 Kolom 3 */}
        <div>
          <p className="font-semibold text-gray-900">Version</p>
          <p className="text-gray-600">{version}</p>
        </div>

        {/* 🟨 Baris ke-2 */}
        <div>
          <p className="font-semibold text-gray-900">Nomor Serial</p>
          <p className="text-gray-600">{nomorSerial}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Kategori</p>
          <p className="text-gray-600">{kategori}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">OS</p>
          <p className="text-gray-600">{os}</p>
        </div>

        {/* 🟨 Baris ke-3 */}
        <div>
          <p className="font-semibold text-gray-900">Nilai Aset</p>
          <p className="text-gray-600">{nilaiAset}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Sub-Kategori</p>
          <p className="text-gray-600">{subKategori}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">IP Address</p>
          <p className="text-gray-600">{ipAddress}</p>
        </div>

        {/* 🟦 Baris ke-4 */}
        <div>
          <p className="font-semibold text-gray-900">Kode BMD</p>
          <p className="text-gray-600">{kodeBMD}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Lokasi</p>
          <p className="text-gray-600">{lokasi}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Hostname</p>
          <p className="text-gray-600">{hostname}</p>
        </div>

        {/* 🟧 Baris ke-5 */}
        <div>
          <p className="font-semibold text-gray-900">Tanggal Perolehan</p>
          <p className="text-gray-600">{tanggalPerolehan}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Kondisi</p>
          <p className="text-gray-600">{kondisi}</p>
        </div>
      </div>
    </div>
  );
};

export default InformasiUtama;
