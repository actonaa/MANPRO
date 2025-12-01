import { useEffect, useState } from "react";
import CardList from "../../components/card/CardList";
import DistribusiKategori from "../../components/dashboard/verifikator/DistribusiKategori";
import StatusJadwalPemeliharaan from "../../components/dashboard/verifikator/StatusJadwalPemeliharaan";
import VerifikasiTertunda from "../../components/dashboard/verifikator/VerifikasiTertunda";

// ============================
// TYPE DEFINITIONS
// ============================
type Asset = {
  status?: {
    name: string;
  };
  approval_status?: string;
};

type Risk = {
  priority?: string;
};

type Maintenance = {
  scheduled_date: string;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  // DATA STATE
  const [countAktif, setCountAktif] = useState(0);
  const [countBelumVerif, setCountBelumVerif] = useState(0);

  // RISKS STATE
  const [countRiskHigh, setCountRiskHigh] = useState(0);

  // MAINTENANCE STATE
  const [countMaintThisWeek, setCountMaintThisWeek] = useState(0);

  useEffect(() => {
    fetchAssets();
    fetchRisks();
    fetchMaintenanceThisWeek();
  }, []);

  // ============================
  // FETCH ASSETS
  // ============================
  const fetchAssets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/assets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: Asset[] = await res.json();

      // Hitung Aset Aktif
      const aktifItems = data.filter((item) => item.status?.name === "Aktif");
      setCountAktif(aktifItems.length);

      // Hitung Aset Belum Diverifikasi
      const belumVerifItems = data.filter(
        (item) => item.approval_status === "pending"
      );
      setCountBelumVerif(belumVerifItems.length);
    } catch (error) {
      console.error("Error fetch asset:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // FETCH RISKS
  // ============================
  const fetchRisks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/risks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: Risk[] = await res.json();

      const highPriority = data.filter((item) => item.priority === "Tinggi");

      setCountRiskHigh(highPriority.length);
    } catch (error) {
      console.error("Error fetch risks:", error);
    }
  };

  // ============================
  // FETCH MAINTENANCE THIS WEEK
  // ============================
  const fetchMaintenanceThisWeek = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/maintenance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: Maintenance[] = await res.json();

      const today = new Date();
      const startOfWeek = new Date(today);
      const endOfWeek = new Date(today);

      // Set minggu dimulai senin → mingguan standard
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      endOfWeek.setDate(today.getDate() - today.getDay() + 7);

      const thisWeek = data.filter((item) => {
        if (!item.scheduled_date) return false;

        const date = new Date(item.scheduled_date);

        return date >= startOfWeek && date <= endOfWeek;
      });

      setCountMaintThisWeek(thisWeek.length);
    } catch (error) {
      console.error("Error fetch maintenance:", error);
    }
  };

  // ============================
  // UI RENDER
  // ============================
  return (
    <>
      <h1 className="font-medium text-sm mb-4 md:text-2xl lg:text-[28px]">
        Dashboard
      </h1>

      {/* CARD RINGKASAN */}
      <div className="mb-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <CardList
            title="Aset Aktif"
            value={String(countAktif)}
            loading={loading}
          />

          <CardList
            title="Jadwal Pemeliharaan Minggu ini"
            value={String(countMaintThisWeek)}
            loading={loading}
          />

          <CardList
            title="Aset Belum Di Verifikasi"
            value={String(countBelumVerif)}
            loading={loading}
          />

          <CardList
            title="Risiko Prioritas Tinggi"
            value={String(countRiskHigh)}
            loading={loading}
          />
        </div>
      </div>

      {/* VERIFIKASI TERTUNDA */}
      <div className="mb-6">
        <VerifikasiTertunda />
      </div>

      {/* DISTRIBUSI GRAPH & STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1 w-full">
          <DistribusiKategori />
        </div>

        <div className="lg:col-span-1 w-full">
          <StatusJadwalPemeliharaan />
        </div>
      </div>
    </>
  );
}
