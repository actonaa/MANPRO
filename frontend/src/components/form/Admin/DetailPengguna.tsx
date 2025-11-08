import { X } from "lucide-react";

interface PopupDetailPenggunaProps {
  isOpen: boolean;
  onClose: () => void;
  pengguna: {
    nama: string;
    email: string;
    peran: string;
    dinas: string;
    status: string;
    idPengguna: string;
    terakhirAktif: string;
    terakhirDiubah: string;
    tanggalDibuat: string;
  } | null;
}

export default function PopupDetailPengguna({
  isOpen,
  onClose,
  pengguna,
}: PopupDetailPenggunaProps) {
  if (!isOpen || !pengguna) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol X */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Detail Pengguna - {pengguna.nama}
        </h2>

        <hr className="mb-6 border-gray-200" />

        {/* Informasi utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
              NAMA
            </p>
            <p className="font-medium text-gray-800">{pengguna.nama}</p>
          </div>

          <div>
            <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
              EMAIL
            </p>
            <p className="font-medium text-gray-800">{pengguna.email}</p>
          </div>

          <div>
            <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
              PERAN
            </p>
            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              {pengguna.peran}
            </span>
          </div>

          <div>
            <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
              ID PENGGUNA
            </p>
            <p className="font-medium text-gray-800">{pengguna.idPengguna}</p>
          </div>

          <div>
            <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
              STATUS
            </p>
            <p
              className={`flex items-center gap-2 ${
                pengguna.status === "Aktif" ? "text-green-600" : "text-red-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pengguna.status === "Aktif" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {pengguna.status}
            </p>
          </div>

          <div>
            <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
              DINAS
            </p>
            <p className="font-medium text-gray-800">{pengguna.dinas}</p>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Informasi waktu */}
        <div className="grid grid-cols-1 sm:grid-cols-3 text-center text-sm text-gray-700">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              TERAKHIR AKTIF
            </p>
            <p>{pengguna.terakhirAktif}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              TERAKHIR DIUBAH
            </p>
            <p>{pengguna.terakhirDiubah}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              TANGGAL DIBUAT
            </p>
            <p>{pengguna.tanggalDibuat}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
