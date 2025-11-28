import { AlertTriangle, CheckCircle } from "lucide-react";

interface AlertStatusProps {
  type: "Aset" | "Risiko"; // bisa tambah lain kalau mau
  name: string; // nama aset atau nama risiko
  status: "Ditolak" | "Disetujui"; // bisa tambahkan "Pending"
  reason?: string; // reason hanya untuk ditolak
  date: string;
}

export default function AlertStatus({
  type,
  name,
  status,
  reason,
  date,
}: AlertStatusProps) {
  // Warna & icon otomatis sesuai status
  const isRejected = status === "Ditolak";

  const colors = isRejected
    ? {
        bg: "#FFFBEA",
        border: "#EAA200",
        title: "#8B5E34",
        text: "#8B5E34",
        date: "#C27A00",
        Icon: AlertTriangle,
      }
    : {
        bg: "#F3FFF3",
        border: "#2ECC71",
        title: "#2D7A4B",
        text: "#2D7A4B",
        date: "#1E8449",
        Icon: CheckCircle,
      };

  const IconComponent = colors.Icon;

  return (
    <div
      className="rounded-xl p-6 shadow-sm relative"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Garis Kiri */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: colors.border }}
      />

      <div className="ml-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="w-5 h-5" style={{ color: colors.border }} />
          <h2 className="font-semibold text-lg" style={{ color: colors.title }}>
            {isRejected ? `Alasan Penolakan ${type}` : `Status ${type}`}
          </h2>
        </div>

        {/* Kalimat Utama */}
        <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
          Permintaan {type.toLowerCase()} untuk{" "}
          <span className="font-medium">"{name}"</span> telah{" "}
          <span className="font-semibold lowercase">{status}</span>.
        </p>

        {/* Alasan hanya jika ditolak */}
        {isRejected && reason && (
          <p
            className="text-sm mt-2 leading-relaxed"
            style={{ color: colors.text }}
          >
            <span className="font-semibold">Alasan:</span> {reason}
          </p>
        )}

        {/* Tanggal */}
        <p className="text-sm mt-3 font-medium" style={{ color: colors.date }}>
          {status} pada: {date}
        </p>
      </div>
    </div>
  );
}
