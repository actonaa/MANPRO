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
  indukAset?: string;

  // TI
  version?: string;
  os?: string;
  ipAddress?: string;
  hostname?: string;
  url?: string;
  tanggalDeploy?: string;
  masaPakai?: string;

  // Non-TI
  materialBahan?: string;
  ukuranSpesifikasi?: string;
  vendor?: string;
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
  url,
  tanggalDeploy,
  masaPakai,
  materialBahan,
  ukuranSpesifikasi,
  vendor,
  indukAset,
}) => {
  const isTI = kategori === "TI";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg text-gray-900">Informasi Utama</h2>
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-gray-900">Status</p>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* =========================================
          =============  LAYOUT TI 4 KOLOM ============
          ========================================= */}
      {isTI ? (
        <div className="grid grid-cols-4 gap-x-10 gap-y-4 text-sm">
          {/* === BARIS 1 === */}
          <div>
            <p className="font-semibold text-gray-900">Merk / Tipe</p>
            <p className="text-gray-600">{merk}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Penanggung Jawab</p>
            <p className="text-gray-600">{penanggungJawab}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Version</p>
            <p className="text-gray-600">{version || "-"}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">URL</p>
            <p className="text-gray-600">{url || "-"}</p>
          </div>

          {/* === BARIS 2 === */}
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
            <p className="text-gray-600">{os || "-"}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Tanggal Deploy</p>
            <p className="text-gray-600">{tanggalDeploy || "-"}</p>
          </div>

          {/* === BARIS 3 === */}
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
            <p className="text-gray-600">{ipAddress || "-"}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Induk Aset</p>
            <p className="text-gray-600">{indukAset || "-"}</p>
          </div>

          {/* === BARIS 4 === */}
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
            <p className="text-gray-600">{hostname || "-"}</p>
          </div>

          <div></div>

          {/* === BARIS 5 === */}
          <div>
            <p className="font-semibold text-gray-900">Tanggal Perolehan</p>
            <p className="text-gray-600">{tanggalPerolehan}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Kondisi</p>
            <p className="text-gray-600">{kondisi}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Masa Pakai</p>
            <p className="text-gray-600">{masaPakai || "-"}</p>
          </div>

          <div></div>
        </div>
      ) : (
        /* =========================================
           ============  LAYOUT NON-TI 3 KOLOM ============
           ========================================= */
        <div className="grid grid-cols-3 gap-x-10 gap-y-4 text-sm">
          {/* === BARIS 1 === */}
          <div>
            <p className="font-semibold text-gray-900">Merk / Tipe</p>
            <p className="text-gray-600">{merk}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Penanggung Jawab</p>
            <p className="text-gray-600">{penanggungJawab}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Material / Bahan</p>
            <p className="text-gray-600">{materialBahan || "-"}</p>
          </div>

          {/* === BARIS 2 === */}
          <div>
            <p className="font-semibold text-gray-900">Nomor Serial</p>
            <p className="text-gray-600">{nomorSerial}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Kategori</p>
            <p className="text-gray-600">{kategori}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Ukuran / Spesifikasi</p>
            <p className="text-gray-600">{ukuranSpesifikasi || "-"}</p>
          </div>

          {/* === BARIS 3 === */}

          <div>
            <p className="font-semibold text-gray-900">Nilai Aset</p>
            <p className="text-gray-600">{nilaiAset}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Sub-Kategori</p>
            <p className="text-gray-600">{subKategori}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Vendor</p>
            <p className="text-gray-600">{vendor || "-"}</p>
          </div>

          {/* === BARIS 4 === */}
          <div>
            <p className="font-semibold text-gray-900">Kode BMD</p>
            <p className="text-gray-600">{kodeBMD}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Lokasi</p>
            <p className="text-gray-600">{lokasi}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Masa Pakai</p>
            <p className="text-gray-600">{masaPakai || "-"}</p>
          </div>

          {/* === BARIS 5 === */}

          <div>
            <p className="font-semibold text-gray-900">Tanggal Perolehan</p>
            <p className="text-gray-600">{tanggalPerolehan}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Kondisi</p>
            <p className="text-gray-600">{kondisi}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformasiUtama;
