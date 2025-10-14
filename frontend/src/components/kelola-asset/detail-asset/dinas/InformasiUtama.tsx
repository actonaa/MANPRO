import React from "react";
import StatusBadge from "../../../status/StatusBadge";

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
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* 🔹 Header Judul + Status */}
      <div className="flex items-start justify-between mb-6">
        <h2 className="font-semibold text-lg">Informasi Utama</h2>

        <div>
          <p className="font-semibold text-gray-900 mb-1">Status</p>
          <div className="flex items-center">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* 🔹 Grid Informasi */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
        <div>
          <p className="font-semibold text-gray-900">Merk / Tipe</p>
          <p className="font-semibold text-gray-500">{merk}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Penanggung Jawab</p>
          <p className="font-semibold text-gray-500">{penanggungJawab}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Nomor Serial</p>
          <p className="font-semibold text-gray-500">{nomorSerial}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Kategori</p>
          <p className="font-semibold text-gray-500">{kategori}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Nilai Aset</p>
          <p className="font-semibold text-gray-500">{nilaiAset}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Sub-Kategori</p>
          <p className="font-semibold text-gray-500">{subKategori}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Kode BMD</p>
          <p className="font-semibold text-gray-500">{kodeBMD}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Lokasi</p>
          <p className="font-semibold text-gray-500">{lokasi}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Tanggal Perolehan</p>
          <p className="font-semibold text-gray-500">{tanggalPerolehan}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">Kondisi</p>
          <p className="font-semibold text-gray-500">{kondisi}</p>
        </div>
      </div>
    </div>
  );
};

export default InformasiUtama;
