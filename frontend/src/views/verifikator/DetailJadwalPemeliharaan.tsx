import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DetailJadwalCard from "../../components/pemeliharaan/verifikator/DetailJadwal";
import InfoPemeliharaan from "../../components/pemeliharaan/verifikator/InfoPemeliharaan";
import DeskripsiPemeliharaan from "../../components/pemeliharaan/verifikator/DeskripsiPemeliharaan";
import RiwayatPemeliharaanCard from "../../components/pemeliharaan/verifikator/RiwayatPemeliharaan";

export default function DetailJadwalPemeliharaan() {
  const navigate = useNavigate(); // ✅ Tambahkan ini agar navigate(-1) berfungsi

  return (
    <>
      {/* 🔹 Header dengan tombol kembali */}
      <div className="flex items-start gap-3 mb-2">
        <ArrowLeft
          className="w-5 h-5 text-gray-700 mt-1 cursor-pointer hover:text-gray-900 transition"
          onClick={() => navigate(-1)}
        />
        <div>
          <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
            Detail Jadwal Pemeliharaan
          </h1>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6 ">
        {/* 🧾 Bagian Utama */}
        <div className="flex flex-col gap-6">
          {/* 🔹 Detail Jadwal */}
          <div className="w-full">
            <DetailJadwalCard
              idJadwal="SCH-001"
              idAset="AST-001"
              namaAset="Laptop Kerja"
              kategori="IT"
              lokasi="Kantor Kepala"
              prioritas="Tinggi"
              tanggalJadwal="12 Jan 2025"
              status="Mendatang"
            />
          </div>

          {/* 🔹 Info Pemeliharaan & Deskripsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <InfoPemeliharaan
              tipePemeliharaan="Terjadwal"
              biaya="Rp 112.000.000"
              vendor="Princess Hami"
            />
            <DeskripsiPemeliharaan deskripsi="Ini adalah catatan atau deskripsi dari detail jadwal pemeliharaan." />
          </div>

          {/* 🔹 Riwayat Pemeliharaan */}
          <div className="w-full">
            <RiwayatPemeliharaanCard
              riwayat={[
                {
                  status: "Completed Maintenance",
                  tanggal: "15 Jan 2024",
                  vendor: "Jane Smith (Vendor)",
                  catatan: "Replaced faulty RAM module. System stable.",
                },
                {
                  status: "Completed Maintenance",
                  tanggal: "05 Nov 2024",
                  vendor: "Tech Solutions Inc.",
                  catatan: "Minor software update and dust cleaning.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
