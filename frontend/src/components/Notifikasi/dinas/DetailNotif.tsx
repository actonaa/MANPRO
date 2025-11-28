import { Link } from "react-router-dom";

export default function DetailNotifikasi() {
  const dummy = {
    name: "Laptop Lenovo A45",
    id: "AST - 115",
    status: "Ditolak" as "Ditolak" | "Disetujui",
    date: "10/12/2025 10:32:12",
    category: "Aset",
    verifier: "Verifikator Dinas Kominfo",
  };

  return (
    <div className="w-full p-6">
      {/* Breadcumb */}
      <p className="text-sm text-gray-400 mb-1">
        <Link
          to="/notifikasi/notifikasi-admin"
          className="text-gray-400 hover:underline hover:text-blue-600 cursor-pointer"
        >
          Notifikasi
        </Link>{" "}
        / Detail Notifikasi
      </p>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Pengajuan Aset Baru</h1>

      {/* Card Utama */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          <div>
            <p className="text-gray-400 text-sm font-semibold">Nama Aset</p>
            <p className="text-gray-800 font-semibold">{dummy.name}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-semibold">ID Aset</p>
            <p className="text-gray-800 font-semibold">{dummy.id}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-semibold">Status</p>
            {dummy.status === "Ditolak" ? (
              <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                Ditolak
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-600 text-sm font-semibold">
                Disetujui
              </span>
            )}
          </div>

          <div>
            <p className="text-gray-400 text-sm font-semibold">
              Tanggal & Waktu Pengajuan
            </p>
            <p className="text-gray-800 font-semibold">{dummy.date}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-semibold">Kategori</p>
            <p className="text-gray-800 font-semibold">{dummy.category}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-semibold">
              Petugas Verifikasi
            </p>
            <p className="text-gray-800 font-semibold">{dummy.verifier}</p>
          </div>
        </div>
      </div>

      {/* ALERT STATUS */}
      <div className="mt-6"></div>
      {/* RENCANA MITIGASI CARD */}
      <div className="mt-6"></div>
    </div>
  );
}
