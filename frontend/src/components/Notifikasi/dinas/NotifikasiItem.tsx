/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, CheckCircle } from "lucide-react";

export default function NotifikasiItem({ notif }: { notif: any }) {
  return (
    <div
      className={`
        flex items-center justify-between px-4 py-5 transition duration-200 shadow-sm group relative
        ${notif.is_read ? "bg-blue-50" : "bg-white"}
      `}
    >
      {/* Kiri */}
      <div className="flex items-center gap-4 w-full max-w-[70%]">
        <input
          type="checkbox"
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />

        <p
          className={`
            text-gray-800 w-20
            ${notif.is_read ? "font-normal" : "font-semibold"}
          `}
        >
          {notif.kategori}
        </p>

        <p className="text-gray-600 text-sm truncate">{notif.pesan}</p>
      </div>

      {/* Kanan - Waktu (hilang saat hover) */}
      <p className="text-sm text-gray-400 transition opacity-100 group-hover:opacity-0">
        {notif.waktu}
      </p>

      {/* Icon Group - Muncul saat hover */}
      <div
        className="
          absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 
          opacity-0 group-hover:opacity-100 transition
        "
      >
        {/* Tandai dibaca */}
        <button
          className="p-2 rounded-full hover:bg-green-100 transition"
          title="Tandai sudah dibaca"
        >
          <CheckCircle
            size={18}
            className="text-gray-400 group-hover:text-green-600 transition"
          />
        </button>

        {/* Hapus */}
        <button
          className="p-2 rounded-full hover:bg-red-100 transition"
          title="Hapus Notifikasi"
        >
          <Trash2
            size={18}
            className="text-gray-400 group-hover:text-red-500 transition"
          />
        </button>
      </div>
    </div>
  );
}
