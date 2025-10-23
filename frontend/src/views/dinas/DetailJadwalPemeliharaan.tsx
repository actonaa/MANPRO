import AgendaPemeliharaanCard from "../../components/pemeliharaan/dinas/AgendaPemeliharaanCard";
import InfoPemeliharaan from "../../components/pemeliharaan/dinas/InfoPemeliharaan";
import LayoutDinas from "../layout/LayoutDinas";

export default function LaptopKerjaDetail() {
  return (
    <LayoutDinas>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-4">
            Pemeliharaan / Jadwal Pemeliharaan /{" "}
            <span className="text-gray-900">Detail Jadwal Pemeliharaan</span>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Laptop Kerja
          </h1>
          <div>
            <InfoPemeliharaan
              idJadwal="SCH-001"
              idAset="AST-001"
              namaAset="Laptop Kerja"
              kategori="Aset TI"
              lokasi="Kantor Pusat"
              prioritas="Tinggi"
              tanggal="12 Jan 2025"
              status="Mendatang"
            />
          </div>

          <div className="bg-white p-6 rounded-xl mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tipe Pemeliharaan */}
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Tipe Pemeliharaan
                </div>
                <div className="text-base font-semibold text-gray-900">
                  Terjadwal
                </div>
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
                <div className="text-base text-gray-900">
                  Ini adalah catatan atau deskripsi dari detail jadwal
                  pemeliharaan
                </div>
              </div>

              {/* Vendor */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Vendor</div>
                <div className="text-base font-semibold text-gray-900">
                  Princess Hami Kelazzz
                </div>
              </div>
            </div>
          </div>

          <div>
            <AgendaPemeliharaanCard />
          </div>
        </div>
      </div>
    </LayoutDinas>
  );
}
