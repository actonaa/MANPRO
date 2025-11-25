type RisikoHeaderProps = {
  title?: string; // judul risiko
  status?: string; // status risiko (new, approved, planned, dll.)
  criteria?: string; // level risiko (High, Medium, Low)
};

export default function RisikoHeader({
  title = "Judul Risiko",
  status = "pending",
  criteria = "Medium",
}: RisikoHeaderProps) {
  // 🎨 Warna badge sesuai level risiko (criteria)
  const getLevelColor = (level: string) => {
    if (["Sangat Rendah", "Rendah", "Low"].includes(level))
      return "bg-[#58DA28]/20 text-[#58DA28]";
    if (["Sedang", "Medium"].includes(level))
      return "bg-[#FFBB4D]/20 text-[#FFBB4D]";
    if (["Tinggi", "Sangat Tinggi", "High"].includes(level))
      return "bg-[#FF2D2D]/20 text-[#FF2D2D]";
    return "bg-gray-200 text-gray-600";
  };

  const getStatusColor = (s: string) => {
    const st = s.toLowerCase();
    if (st === "approved") return " text-[#58DA28]"; // hijau
    if (st === "pending") return " text-[#FFBB4D]"; // kuning
    if (st === "planned") return " text-[#FFBB4D]"; // kuning
    if (st === "rejected") return " text-[#FF2D2D]"; // merah
    return "bg-gray-200 text-gray-600";
  };

  // 🧠 Konversi status API → teks tampil
  const formatStatus = (s: string) => {
    switch (s.toLowerCase()) {
      case "new":
        return "Baru";
      case "pending":
        return "Menunggu Persetujuan";
      case "approved":
        return "Disetujui";
      case "planned":
        return "Dalam Perencanaan";
      case "rejected":
        return "Ditolak";
      default:
        return s;
    }
  };

  return (
    <div className="mb-6">
      {/* 📍 Breadcrumb */}
      <p className="text-sm text-gray-400 font-medium mb-1">
        <a href="/risiko" className="hover:underline">
          Daftar Risiko
        </a>
        <span className="text-gray-500"> / Detail Risiko</span>
      </p>

      {/* 📊 Judul */}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {/* 🧠 Status + Level Risiko */}
      <div className="flex items-center gap-3 mt-2">
        <p className="text-sm flex items-center gap-2">
          <span className="text-gray-400 font-semibold">STATUS :</span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              status
            )}`}
          >
            {formatStatus(status)}
          </span>

          {/* ➖ Garis pemisah vertikal */}
          <span className="w-[1px] h-4 bg-black mx-2"></span>

          {/* 🎨 Badge level risiko */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
              criteria
            )}`}
          >
            {criteria}
          </span>
        </p>
      </div>
    </div>
  );
}
