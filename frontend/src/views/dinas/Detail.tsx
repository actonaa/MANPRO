import { useState } from "react";
import ButtonText from "../../components/button/ButtonText";
import InformasiUtama from "../../components/kelola-asset/dinas/InformasiUtama";
import JadwalPemeliharaan from "../../components/kelola-asset/dinas/JadwalPemeliharaan";
import KeterkaitanRisiko from "../../components/kelola-asset/dinas/KeterkaitanRisiko";
import Lampiran from "../../components/kelola-asset/dinas/Lampiran";
import RiwayatAktivitas from "../../components/kelola-asset/dinas/RiwayatAktivitas";
import ScanBarcode from "../../components/kelola-asset/dinas/ScanBarcode";
import SiklusHidup from "../../components/kelola-asset/dinas/SiklusHidup";
import LayoutDinas from "../layout/LayoutDinas";

export default function DetailAset() {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [alasan, setAlasan] = useState("");

  const handleDeleteClick = () => setShowDeletePopup(true);
  const handleClosePopup = () => {
    setShowDeletePopup(false);
    setShowConfirmPopup(false);
    setAlasan("");
  };

  const handleNextConfirm = () => {
    setShowDeletePopup(false);
    setShowConfirmPopup(true);
  };

  const handleDeleteFinal = () => {
    alert("Aset berhasil dihapus ✅");
    handleClosePopup();
  };

  return (
    <LayoutDinas>
      <div className="pb-10">
        {/* 🔹 Header Atas */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              Kelola Aset / Detail Aset
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-gray-700 mt-1">
              LAPTOP ASUS ZENBOOK
            </p>
            <p className="text-sm text-gray-500">
              AST - 003 • Terakhir diperbarui 10-12-2025
            </p>
          </div>

          {/* 🔘 Tombol Aksi */}
          <div className="flex flex-row items-center justify-center gap-3">
            <a href="/insiden">
              <ButtonText
                title="Insiden"
                color="bg-white"
                hoverColor="hover:bg-gray-100"
                textColor="text-gray-700"
                fontWeight="font-medium"
              />
            </a>
            <a href="/aset/tambah">
              <ButtonText
                title="Ubah"
                color="bg-[#BFDEFF]"
                hoverColor="hover:bg-[#A5D4FF]"
                textColor="text-[#007BFF]"
                fontWeight="font-medium"
              />
            </a>
            <button onClick={handleDeleteClick}>
              <ButtonText
                title="Hapus Aset"
                color="bg-[#FECACA]"
                hoverColor="hover:bg-[#FCA5A5]"
                textColor="text-[#991B1B]"
                fontWeight="font-medium"
              />
            </button>
          </div>
        </div>

        {/* 🔹 Layout Utama Dua Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-5">
            <InformasiUtama
              merk="ASUS Zenbook 247"
              penanggungJawab="Ahmad Syaifudin"
              status="Aktif"
              nomorSerial="091092010"
              kategori="TI"
              subKategori="Hardware"
              nilaiAset="Rp 10.000.000"
              kodeBMD="BMD12345"
              lokasi="Ruang TU"
              tanggalPerolehan="12-01-2025"
              kondisi="Rusak - Ringan"
            />
            <SiklusHidup
              siklus={[
                { tahap: "Pengadaan", tanggal: "10 Januari 2024" },
                { tahap: "Penggunaan", tanggal: "20 Februari 2024" },
                { tahap: "Pemeliharaan Berkala", tanggal: "15 Juni 2024" },
                { tahap: "Penghapusan (Estimasi)", tanggal: "2027" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-5">
            <JadwalPemeliharaan
              jadwal={[
                { tanggal: "11 Okt 2025", kegiatan: "Ganti thermal pasta CPU" },
                { tanggal: "13 Okt 2025", kegiatan: "Cek disk health & SMART" },
                { tanggal: "16 Okt 2025", kegiatan: "Patch firmware ILO" },
              ]}
            />
            <KeterkaitanRisiko
              risiko={[
                {
                  kode: "RSK-009",
                  deskripsi:
                    "Downtime kritikal jika PSU gagal (Dampak: Tinggi)",
                  dampak: "Tinggi",
                },
                {
                  kode: "RSK-014",
                  deskripsi:
                    "Kinerja turun karena suhu ruangan (Dampak: Sedang)",
                  dampak: "Sedang",
                },
              ]}
            />
            <RiwayatAktivitas
              aktivitas={[
                {
                  tanggal: "09 Okt 2025",
                  deskripsi: "Perbaikan kipas chassis — Selesai",
                  status: "Selesai",
                },
                {
                  tanggal: "02 Sep 2025",
                  deskripsi: "Penggantian PSU — Selesai",
                  status: "Selesai",
                },
                {
                  tanggal: "15 Jul 2025",
                  deskripsi: "Pembersihan debu — Selesai",
                  status: "Selesai",
                },
              ]}
            />
          </div>
        </div>

        {/* 🔹 Lampiran & Scan Barcode */}
        <div className="flex flex-col lg:flex-row gap-5 mt-6">
          <Lampiran lampiran={[]} />
          <ScanBarcode barcodeUrl="skjskjd.com" />
        </div>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 shadow-lg">
            {/* 🔹 Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Hapus Laptop Asus Zenbook
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 🔹 Informasi Utama */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Informasi Utama
              </h3>

              {/* Grid 2 kolom */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Nama Aset:</span>
                  <br />
                  Laptop Kerja
                </p>
                <p>
                  <span className="font-medium">Kategori Aset:</span>
                  <br />
                  TI
                </p>
                <p>
                  <span className="font-medium">Merk/Tipe Aset:</span>
                  <br />
                  Zenbook
                </p>
                <p>
                  <span className="font-medium">Sub Kategori:</span>
                  <br />
                  Hardware
                </p>
                <p>
                  <span className="font-medium">Serial Number:</span>
                  <br />
                  091092010
                </p>
                <p>
                  <span className="font-medium">Lokasi Aset:</span>
                  <br />
                  Ruang TU
                </p>
                <p>
                  <span className="font-medium">Tgl. Perolehan:</span>
                  <br />
                  12 Oktober 2025
                </p>
                <p>
                  <span className="font-medium">Penanggung Jawab:</span>
                  <br />
                  Rahadian Bisma
                </p>
                <p>
                  <span className="font-medium">Kondisi:</span>
                  <br />
                  Baik
                </p>
                <p>
                  <span className="font-medium">Kode BMD:</span>
                  <br />
                  BMD - 001 - 254
                </p>
                <p>
                  <span className="font-medium">Biaya Aset:</span>
                  <br />
                  Rp25.000,00
                </p>
                <p>
                  <span className="font-medium">Nama Dinas:</span>
                  <br />
                  Dinas Komunikasi dan Informatika
                </p>
              </div>
            </div>

            {/* 🔹 Input Alasan */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alasan
              </label>
              <textarea
                className="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-blue-200"
                rows={2}
                placeholder="Ketik alasan"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
              />
            </div>

            {/* 🔹 Tombol Aksi */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleNextConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg"
              >
                Hapus
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧩 POPUP 2: Konfirmasi akhir */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-md p-5 text-center">
            <h2 className="text-lg font-semibold mb-3">
              Hapus Laptop Asus Zenbook
            </h2>
            <p className="text-gray-700 mb-5">
              Apakah anda yakin ingin menghapus aset{" "}
              <span className="font-semibold">“Laptop Asus Zenbook”</span>?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeleteFinal}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg"
              >
                Hapus
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutDinas>
  );
}
