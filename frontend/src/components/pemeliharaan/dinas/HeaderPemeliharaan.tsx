import { Link } from "react-router-dom";

type Props = {
  id: string;
  lastUpdate: string;
};

export default function HeaderPemeliharaan({ id, lastUpdate }: Props) {
  return (
    <div className="mb-6">
      {/* 🧭 Breadcrumb navigasi */}
      <div className="flex items-center text-sm text-gray-500 mb-2 space-x-1">
        <Link
          to="/pemeliharaan"
          className="hover:text-blue-600 transition font-medium"
        >
          Pemeliharaan
        </Link>
        <span>/</span>
        <Link
          to="/jadwal-pemeliharaan"
          className="hover:text-blue-600 transition font-medium"
        >
          Jadwal Pemeliharaan
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">
          Detail Laporan Pemeliharaan
        </span>
      </div>

      {/* 📄 Judul utama */}
      <h1 className="text-2xl font-bold text-gray-900">LAPTOP ASUS ZENBOOK</h1>

      {/* 🕐 Info tambahan */}
      <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
        <span>{id}</span>
        <span className="text-gray-400">—</span>
        <span>Terakhir diperbarui {lastUpdate}</span>
      </div>
    </div>
  );
}
