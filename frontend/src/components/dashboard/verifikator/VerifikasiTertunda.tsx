import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, ShieldCheck } from "lucide-react";

type Asset = {
  approval_status?: string;
};

type Risk = {
  approval_status?: string;
};

type VerifikasiCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  to: string;
  loading: boolean;
};

function VerifikasiCard({
  icon,
  title,
  subtitle,
  value,
  to,
  loading,
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
        {loading ? (
          <div className="w-6 h-6 border-4 border-[#3850FB] border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-[#3850FB] text-2xl font-bold">{value}</span>
        )}
        <span className="text-[#3850FB] text-xl font-semibold">&gt;</span>
      </div>
    </div>
  );
}

export default function VerifikasiTertunda() {
  const [pendingAssetCount, setPendingAssetCount] = useState(0);
  const [pendingRiskCount, setPendingRiskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [assetRes, riskRes] = await Promise.all([
        fetch("https://asset-risk-management.vercel.app/api/assets", {
          headers,
        }),
        fetch("https://asset-risk-management.vercel.app/api/risks", {
          headers,
        }),
      ]);

      const assetData: Asset[] = await assetRes.json();
      const riskData: Risk[] = await riskRes.json();

      const pendingAssets = assetData.filter(
        (a) => a.approval_status === "pending"
      );
      const pendingRisks = riskData.filter(
        (r) => r.approval_status === "pending"
      );

      setPendingAssetCount(pendingAssets.length);
      setPendingRiskCount(pendingRisks.length);
    } catch (err) {
      console.error("Error fetching pending data:", err);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    {
      icon: <Archive size={36} strokeWidth={1.5} />,
      title: "Verifikasi Aset Tertunda",
      subtitle: "Anda memiliki Aset yang menunggu persetujuan.",
      value: pendingAssetCount,
      to: "/aset-verifikator",
    },
    {
      icon: <ShieldCheck size={36} strokeWidth={1.5} />,
      title: "Verifikasi Risiko Tertunda",
      subtitle: "Risiko menunggu untuk ditinjau.",
      value: pendingRiskCount,
      to: "/risiko-verifikator",
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Verifikasi Tertunda</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, i) => (
          <VerifikasiCard key={i} {...item} loading={loading} />
        ))}
      </div>
    </div>
  );
}
