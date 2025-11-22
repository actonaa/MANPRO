import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import RisikoSetuju from "../../components/form/verifikator/RisikoSetuju";
import RisikoTolak from "../../components/form/verifikator/RisikoTolak";

type TableRisikoProps = {
  selectedLevel?: string;
  selectedDate?: { start: string; end: string } | null;
};

type RisikoItem = {
  id: string;
  date: string;
  title: string;
  criteria: string;
  category: string;
  entry_level: number;
  asset?: { name: string | null; lokasi: string | null };
  department?: { name: string | null };
};

type ApiRisk = {
  id: string;
  title: string;
  criteria: string;
  entry_level: number;
  approval_status: string;
  created_at: string;
  asset_info: { id: string | null; name: string | null };
  risk_category: { name: string };
  department: { name: string } | null;
};

export default function TableRisiko({
  selectedLevel = "",
  selectedDate = null,
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [selectedRisiko, setSelectedRisiko] = useState<RisikoItem | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);

  useEffect(() => {
    const fetchRisks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const resRisks = await axios.get<ApiRisk[]>(
          "https://asset-risk-management.vercel.app/api/risks",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const pendingRisks = resRisks.data.filter(
          (r) => r.approval_status.toLowerCase() === "pending"
        );

        const mappedRisks: RisikoItem[] = pendingRisks.map((r) => ({
          id: r.id,
          date: r.created_at.split("T")[0],
          title: r.title,
          criteria: r.criteria,
          category: r.risk_category?.name || "-",
          entry_level: r.entry_level,
          asset: r.asset_info
            ? { name: r.asset_info.name, lokasi: null }
            : undefined,
          department: r.department ? { name: r.department.name } : undefined,
        }));

        setData(mappedRisks);
      } catch (error) {
        console.error("Gagal fetch risiko:", error);
      } finally {
        setLoading(false); // <-- penting
      }
    };

    fetchRisks();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesLevel = selectedLevel
      ? item.criteria.toLowerCase() === selectedLevel.toLowerCase()
      : true;
    const matchesDate = selectedDate
      ? item.date >= selectedDate.start && item.date <= selectedDate.end
      : true;
    return matchesLevel && matchesDate;
  });

  const handleApproveClick = (item: RisikoItem) => {
    setSelectedRisiko(item);
    setShowApproveModal(true);
  };

  const handleRejectClick = (item: RisikoItem) => {
    setSelectedRisiko(item);
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedRisiko) return;
    setApproveLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `https://asset-risk-management.vercel.app/api/risks/${selectedRisiko.id}/verify`,
        { approval_status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Risiko disetujui:", selectedRisiko);

      // Update local state agar langsung hilang dari tabel
      setData((prev) => prev.filter((r) => r.id !== selectedRisiko.id));

      setShowApproveModal(false);
      setSelectedRisiko(null);
    } catch (error) {
      console.error("Gagal menyetujui risiko:", error);
    } finally {
      setApproveLoading(false);
    }
  };

  const confirmReject = () => {
    console.log("❌ Risiko ditolak:", selectedRisiko);
    setShowRejectModal(false);
    setSelectedRisiko(null);
  };

  return (
    <div className="md:pb-10 lg:bg-white lg:shadow-xl lg:p-5 lg:rounded-2xl relative">
      {/* Tabel Desktop */}
      <div className="hidden lg:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">TANGGAL</th>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">KATEGORI RISK</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50 transition"
              >
                <td className="py-5 px-4">{item.date}</td>
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.asset?.name || "-"}</td>
                <td className="py-5 px-4">{item.title}</td>
                <td
                  className={`py-5 px-4 font-semibold ${
                    item.criteria === "High"
                      ? "text-red-500"
                      : item.criteria === "Medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {item.criteria}
                </td>
                <td className="py-5 px-4">{item.category}</td>
                <td className="py-5 px-4">{item.entry_level}</td>
                <td className="py-5 px-4 flex items-center justify-center gap-3 text-gray-500">
                  <a
                    href="/risiko-verifikator/detail"
                    className="hover:text-blue-600"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </a>
                  <button
                    onClick={() => handleApproveClick(item)}
                    className="hover:text-green-600"
                    title="Setujui Risiko"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleRejectClick(item)}
                    className="hover:text-red-600"
                    title="Tolak Risiko"
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {item.asset?.name || "-"}
            </p>
            <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
              <p>
                <span className="font-medium text-gray-700">ID:</span> {item.id}
              </p>
              <p>
                <span className="font-medium text-gray-700">Level:</span>{" "}
                <span
                  className={`${
                    item.criteria === "High"
                      ? "text-red-500"
                      : item.criteria === "Medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  } font-semibold`}
                >
                  {item.criteria}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Kategori Risk:
                </span>{" "}
                {item.category}
              </p>
              <p>
                <span className="font-medium text-gray-700">Skor:</span>{" "}
                {item.entry_level}
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-4 text-gray-500">
              <a
                href="/risiko-verifikator/detail"
                className="hover:text-blue-600"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </a>
              <button
                onClick={() => handleApproveClick(item)}
                className="hover:text-green-600"
                title="Setujui Risiko"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleRejectClick(item)}
                className="hover:text-red-600"
                title="Tolak Risiko"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="w-full mt-4">
          {/* Skeleton Desktop */}
          <div className="hidden lg:block">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse grid grid-cols-8 gap-4 py-3 border-b border-b-gray-200"
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            ))}
          </div>

          {/* Skeleton Mobile */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-4 border border-gray-200 rounded-xl"
              >
                <div className="h-3 w-24 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded mb-4"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>

                <div className="flex gap-3 mt-4">
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup */}
      {showApproveModal && selectedRisiko && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <RisikoSetuju
            namaRisiko={selectedRisiko.title}
            asetTerkait={selectedRisiko.asset?.name || "-"}
            onCancel={() => setShowApproveModal(false)}
            onConfirm={confirmApprove}
            loading={approveLoading} // <-- tambahkan prop loading
          />
        </div>
      )}
      {showRejectModal && selectedRisiko && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <RisikoTolak
            namaRisiko={selectedRisiko.title}
            asetTerkait={selectedRisiko.asset?.name || "-"}
            onCancel={() => setShowRejectModal(false)}
            onConfirm={confirmReject}
          />
        </div>
      )}
    </div>
  );
}
