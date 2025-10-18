type Props = {
  info?: {
    merk: string;
    penanggungJawab: string;
    status: "Aktif" | "Perbaikan" | "Tidak Aktif";
    nomorSerial: string;
    kategori: string;
    subKategori: string;
    nilaiAset: string;
    kodeBMD: string;
    tanggalPerolehan: string;
    kondisi: string;
    lokasi: string;
  };
};

export default function InformasiUtamaCard({
  info = {
    merk: "Asus Zenbook 247",
    penanggungJawab: "Ahmad Syahrioni",
    status: "Aktif",
    nomorSerial: "09102920",
    kategori: "TI",
    subKategori: "Hardware",
    nilaiAset: "Rp. 1.000.000",
    kodeBMD: "21 Desember 2025",
    tanggalPerolehan: "12 - 01 - 2025",
    kondisi: "Baik - Ringan",
    lokasi: "Ruang TU",
  },
}: Props) {
  // 🔄 Warna status dinamis
  const statusClasses = {
    Aktif: "bg-green-200 text-green-800",
    Perbaikan: "bg-yellow-200 text-yellow-800",
    "Tidak Aktif": "bg-red-200 text-red-800",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">Informasi Utama</h2>

      {/* 📊 Grid dua kolom */}
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        {/* Kolom Kiri */}
        <div className="space-y-2">
          <div>
            <p className="font-bold text-gray-700">Merk / Tipe</p>
            <p className="font-bold text-gray-400">{info.merk}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Nomor Serial</p>
            <p className="font-bold text-gray-400">{info.nomorSerial}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Nilai Aset</p>
            <p className="font-bold text-gray-400">{info.nilaiAset}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Kode BMD</p>
            <p className="font-bold text-gray-400">{info.kodeBMD}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Tanggal Perolehan</p>
            <p className="font-bold text-gray-400">{info.tanggalPerolehan}</p>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-700">Penanggung Jawab</p>
              <p className="font-bold text-gray-400">{info.penanggungJawab}</p>
            </div>
            {/* ✅ Badge Status */}
            <span
              className={`px-4 py-1 rounded-full text-sm font-bold ${
                statusClasses[info.status]
              }`}
            >
              {info.status}
            </span>
          </div>

          <div>
            <p className="font-bold text-gray-700">Kategori</p>
            <p className="font-bold text-gray-400">{info.kategori}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Sub-Kategori</p>
            <p className="font-bold text-gray-400">{info.subKategori}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Lokasi</p>
            <p className="font-bold text-gray-400">{info.lokasi}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Kondisi</p>
            <p className="font-bold text-gray-400">{info.kondisi}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
