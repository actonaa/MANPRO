import { useNavigate } from "react-router-dom";
import { Archive, ShieldCheck } from "lucide-react"; // 📦 line icons

type VerifikasiCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  to: string;
};

function VerifikasiCard({
  icon,
  title,
  subtitle,
  value,
  to,
}: VerifikasiCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      className="flex items-center justify-between bg-[#EEF5FF] hover:bg-[#E4EEFF] cursor-pointer transition p-5 rounded-2xl shadow-sm w-full"
    >
      <div className="flex items-start gap-4">
        <div className="text-[#3850FB]">{icon}</div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#3850FB] text-2xl font-bold">{value}</span>
        <span className="text-[#3850FB] text-xl font-semibold">&gt;</span>
      </div>
    </div>
  );
}

export default function VerifikasiTertunda() {
  const data = [
    {
      icon: <Archive size={36} strokeWidth={1.5} />, // 📁 outline biru
      title: "Verifikasi Aset Tertunda",
      subtitle: "Anda memiliki Aset yang menunggu persetujuan Anda.",
      value: 24,
      to: "/verifikasi-aset",
    },
    {
      icon: <ShieldCheck size={36} strokeWidth={1.5} />, // 🛡️ outline biru
      title: "Verifikasi Risiko Tertunda",
      subtitle: "Risiko Menunggu Ditinjau",
      value: 14,
      to: "/verifikasi-risiko",
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Verifikasi Tertunda</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, i) => (
          <VerifikasiCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
