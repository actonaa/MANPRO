interface NotificationsProps {
  compact?: boolean; // kalau true, tampil sebagai icon saja
}

export default function Notifications({ compact = false }: NotificationsProps) {
  if (compact) {
    // 🔔 Versi icon saja (untuk navbar mobile)
    return (
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition sm:hidden" // tampil hanya di mobile
        aria-label="Notifikasi"
      >
        <span className="text-gray-600 text-xl">🔔</span>
        {/* Titik merah (indikator notifikasi baru) */}
        <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    );
  }

  // 🖥️ Versi penuh (untuk dashboard desktop)
  return (
    <div className="hidden sm:flex p-4 flex-col items-center text-center">
      <div className="text-gray-400 text-3xl mb-2">🔔</div>
      <p className="text-sm font-semibold">Belum ada notifikasi</p>
      <p className="text-xs text-gray-500">
        Kami akan memberitahu Anda ketika ada pembaruan
      </p>
    </div>
  );
}
