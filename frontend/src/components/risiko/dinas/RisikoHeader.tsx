export default function RisikoHeader() {
  const statusLevel = "Tinggi"; // bisa diganti dari props

  // 🎨 Warna badge sesuai level risiko
  const getStatusColor = (level: string) => {
    if (level === "Sangat Rendah" || level === "Rendah")
      return "bg-[#58DA28]/20 text-[#58DA28]";
    if (level === "Sedang") return "bg-[#FFBB4D]/20 text-[#FFBB4D]";
    if (level === "Tinggi" || level === "Sangat Tinggi")
      return "bg-[#FF2D2D]/20 text-[#FF2D2D]";
    return "bg-gray-200 text-gray-600";
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
      <h1 className="text-2xl font-bold text-gray-900">
        Risiko Serangan Siber
      </h1>

      {/* 🧠 Status + Tingkat Risiko */}
      <div className="flex items-center gap-3 mt-2">
        <p className="text-sm flex items-center gap-2">
          <span className="text-gray-400 font-semibold">STATUS :</span>
          <span className="text-gray-800 font-semibold">Dalam Penanganan</span>

          {/* ➖ Garis pemisah vertikal */}
          <span className="w-[1px] h-4 bg-black mx-2"></span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              statusLevel
            )}`}
          >
            {statusLevel}
          </span>
        </p>
      </div>
    </div>
  );
}
