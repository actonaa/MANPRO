/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, MailCheck } from "lucide-react";

export default function NotifikasiItem({
  notif,
  selected = false,
  onToggleSelect,
  onMarkRead,
  onDelete,
}: {
  notif: any;
  selected?: boolean;
  onToggleSelect?: () => void;
  onMarkRead?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`
        flex items-center justify-between px-4 py-5 transition duration-200 shadow-sm group relative 
        ${notif.is_read ? "bg-blue-50" : "bg-white"}
      `}
    >
      {/* Kiri */}
      <div className="flex items-center gap-4 w-full max-w-[70%]">
        {/* Checkbox per item */}
        <input
          type="checkbox"
          checked={!!selected}
          onChange={onToggleSelect}
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />

        {/* Kategori */}
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

      {/* Waktu (hilang saat hover) */}
      <p className="text-sm text-gray-400 transition opacity-100 group-hover:opacity-0">
        {notif.waktu}
      </p>

      {/* Icon Group: muncul saat hover OR jika item tercentang (selected) */}
      <div
        className={`
    absolute right-4 top-1/2 -translate-y-1/2 flex gap-3
    transition
    opacity-0 group-hover:opacity-100
  `}
      >
        {/* Jika item tercentang dan hanya satu selected, pengguna ingin tombol tandai (but list handles logic).
            Kita tetap beri tombol mark per item */}
        <button
          onClick={onMarkRead}
          className="p-2 rounded-full hover:bg-green-100 transition"
          title="Tandai sudah dibaca"
        >
          <MailCheck
            size={18}
            className="text-gray-400 group-hover:text-green-600 transition"
          />
        </button>

        {/* Hapus per-item */}
        <button
          onClick={onDelete}
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
