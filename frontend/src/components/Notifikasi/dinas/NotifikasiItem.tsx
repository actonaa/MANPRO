import { Trash2 } from "lucide-react";

export default function NotifikasiItem({ notif }: { notif: any }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white 
      hover:bg-gray-50 transition duration-200 shadow-sm"
    >
      {/* ✅ Kiri: Checkbox + kategori + pesan */}
      <div className="flex items-center gap-4 w-full max-w-[70%]">
        <input
          type="checkbox"
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />
        <p className="font-semibold text-gray-800 w-20">{notif.kategori}</p>
        <p className="text-gray-600 text-sm truncate">{notif.pesan}</p>
      </div>

      {/* ✅ Kanan: waktu + tombol hapus */}
      <div className="flex items-center gap-5">
        <p className="text-sm text-gray-400">{notif.waktu}</p>
        <button
          className="p-2 rounded-full hover:bg-red-100 transition group"
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
