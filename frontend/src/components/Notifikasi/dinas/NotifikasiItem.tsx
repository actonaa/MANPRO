/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, MailCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // 🔥 Klik pada container → navigate ke detail
  const goToDetail = () => {
    navigate(`/notifikasi/${notif.id}`);
  };

  return (
    <div
      onClick={goToDetail}
      className={`
        flex items-center justify-between px-4 py-5 transition duration-200 shadow-sm group relative cursor-pointer
        ${notif.is_read ? "bg-blue-50" : "bg-white"}
      `}
    >
      {/* Kiri */}
      <div className="flex items-center gap-4 w-full max-w-[70%]">
        {/* Checkbox per item */}
        <input
          type="checkbox"
          checked={!!selected}
          onClick={(e) => e.stopPropagation()}
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

        <p className="text-gray-600 text-sm truncate ml-10">{notif.pesan}</p>
      </div>

      {/* Waktu */}
      <p className="text-sm text-gray-400 transition opacity-100 group-hover:opacity-0">
        {notif.waktu}
      </p>

      {/* Icon Group */}
      <div
        className={`
          absolute right-4 top-1/2 -translate-y-1/2 flex gap-3
          transition
          opacity-0 group-hover:opacity-100
        `}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // ⛔ hindari navigate
            onMarkRead?.();
          }}
          className="p-2 rounded-full hover:bg-green-100 transition"
          title="Tandai sudah dibaca"
        >
          <MailCheck
            size={18}
            className="text-gray-400 group-hover:text-green-600 transition"
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // ⛔ hindari navigate
            onDelete?.();
          }}
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
