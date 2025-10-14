import LayoutDinas from "../layout/LayoutDinas";
import InformasiUtama from "../../components/kelola-asset/dinas/InformasiUtama";
import JadwalPemeliharaan from "../../components/kelola-asset/dinas/JadwalPemeliharaan";
import KeterkaitanRisiko from "../../components/kelola-asset/dinas/KeterkaitanRisiko";
import Lampiran from "../../components/kelola-asset/dinas/Lampiran";
import RiwayatAktivitas from "../../components/kelola-asset/dinas/RiwayatAktivitas";
import ScanBarcode from "../../components/kelola-asset/dinas/ScanBarcode";
import SiklusHidup from "../../components/kelola-asset/dinas/SiklusHidup";

export default function KelolaAset() {
  return (
    <LayoutDinas>
      <div className="space-y-8">
        <InformasiUtama
          merk="Asus Zenbook 247"
          penanggungJawab="Dinas TI"
          status="Aktif"
          nomorSerial="09102920"
          kategori="TI"
          subKategori="Hardware"
          nilaiAset="Rp. 1.000.000"
          kodeBMD="TI-001-2025"
          lokasi="Gedung A - Lantai 2"
          tanggalPerolehan="2023-01-15"
          kondisi="Baik"
        />

        <JadwalPemeliharaan
          jadwal={[
            { tanggal: "2025-01-10", kegiatan: "Pengecekan hardware tahunan" },
            { tanggal: "2025-05-15", kegiatan: "Perawatan berkala perangkat" },
          ]}
        />

        <KeterkaitanRisiko
          risiko={[
            {
              kode: "R-001",
              deskripsi: "Potensi overheating akibat penggunaan berlebih",
              dampak: "Sedang",
            },
            {
              kode: "R-002",
              deskripsi: "Kemungkinan kehilangan aset karena pencurian",
              dampak: "Tinggi",
            },
          ]}
        />

        <Lampiran
          lampiran={[
            { nama: "Invoice.pdf", url: "/files/invoice.pdf" },
            { nama: "FotoAset.jpg", url: "/files/fotoaset.jpg" },
            { nama: "Garansi.pdf", url: "/files/garansi.pdf" },
          ]}
        />

        <RiwayatAktivitas
          aktivitas={[
            {
              tanggal: "2024-12-20",
              deskripsi: "Perawatan software rutin",
              status: "Selesai",
            },
            {
              tanggal: "2025-02-11",
              deskripsi: "Penggantian baterai laptop",
              status: "Dalam Proses",
            },
          ]}
        />

        <ScanBarcode barcodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=09102920" />

        <SiklusHidup
          siklus={[
            { tahap: "Pengadaan", tanggal: "2023-01-15" },
            { tahap: "Penggunaan", tanggal: "2023-02-01" },
            { tahap: "Pemeliharaan Berkala", tanggal: "2025-01-10" },
          ]}
        />
      </div>
    </LayoutDinas>
  );
}
