import { Link } from "react-router-dom";

export default function Internal500() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden font-sans">
      {/* 🔵 Lingkaran kiri atas */}
      <div className="absolute -top-32 -left-32 w-[300px] h-[300px] border-[40px] border-[#007DFA] rounded-full"></div>

      {/* 🔵 Lingkaran kanan */}
      <div className="absolute top-[22%] -right-36 w-[300px] h-[300px] border-[40px] border-[#007DFA] rounded-full"></div>

      {/* 🔲 Kotak titik kiri bawah */}
      <div className="absolute bottom-16 left-16 grid grid-cols-6 gap-3">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#007DFA] rounded-full"></div>
        ))}
      </div>

      {/* 🔲 Kotak titik kanan bawah */}
      <div className="absolute bottom-6 right-20 grid grid-cols-6 gap-3">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#007DFA] rounded-full"></div>
        ))}
      </div>

      {/* 📍 Konten Tengah */}
      <div className="text-center z-10">
        <h1 className="text-[140px] font-semibold text-[#007DFA] leading-none">
          500
        </h1>
        <h2 className="text-3xl font-semibold text-[#007DFA] mt-2">
          Kesalahan Server Internal
        </h2>
        <p className="text-gray-500 mt-3">
          Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.
        </p>
        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-[#007DFA] text-white px-8 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-[#0065c7] transition"
        >
          Kembali Ke Dashboard
        </Link>
      </div>
    </div>
  );
}
