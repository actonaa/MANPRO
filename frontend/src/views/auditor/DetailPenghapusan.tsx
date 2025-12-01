import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ExportModal from "../../components/dropdown/Export";

export default function DetailLaporanPenghapusan() {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil id dari URL
  const [showExportModal, setShowExportModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://asset-risk-management.vercel.app/api/assets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const asset = await res.json();

        // mapping data sesuai UI
        setData({
          id: asset.id,
          nama: asset.name,
          nilai: asset.acquisition_value
            ? `Rp${asset.acquisition_value.toLocaleString()}`
            : "-",
          tanggal: asset.updated_at
            ? new Date(asset.updated_at).toLocaleDateString("id-ID")
            : "-",
          unit: asset.department?.name || "-",
          pic: asset.pic || "-",
          alasan: asset.revision_notes || "-",
        });
      } catch (err) {
        console.error("Error fetching asset:", err);
      }
    };

    if (id) fetchAsset();
  }, [id]);

  if (!data) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="">
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <span className="text-sm text-gray-500">
          Laporan Penghapusan /{" "}
          <span className="text-gray-900 font-medium">
            Detail Laporan Penghapusan
          </span>
        </span>
      </div>

      {/* Header + Export */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">{data.id}</h1>
          <p className="text-gray-500 mt-1">{data.nama}</p>
        </div>

        {/* Export Button */}
        <button
          onClick={() => setShowExportModal(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`flex items-center gap-2 py-2 px-4 rounded-md border transition
            ${
              hover
                ? "bg-gray-100 border-gray-400 text-gray-800"
                : "bg-white border-gray-300 text-gray-600"
            }`}
        >
          <Download
            className={`w-4 h-4 ${hover ? "text-gray-800" : "text-gray-600"}`}
          />
          <span className={hover ? "text-gray-800" : "text-gray-600"}>
            Export
          </span>
        </button>
      </div>

      {/* Card Detail */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-10">
          <div>
            <p className="text-sm text-gray-500">ID Aset</p>
            <p className="font-semibold text-gray-800">{data.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Nama Aset</p>
            <p className="font-semibold text-gray-800">{data.nama}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Nilai Aset</p>
            <p className="font-semibold text-gray-800">{data.nilai}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tanggal Penghapusan</p>
            <p className="font-semibold text-gray-800">{data.tanggal}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Unit Kerja</p>
            <p className="font-semibold text-gray-800">{data.unit}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">PIC</p>
            <p className="font-semibold text-gray-800">{data.pic}</p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-sm text-gray-500 mb-1">Alasan Penghapusan</p>
          <p className="text-gray-800 font-medium">{data.alasan}</p>
        </div>
      </div>

      {/* MODAL EXPORT */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={(format) => {
            console.log("Export Laporan Penghapusan:", format);
            setShowExportModal(false);
          }}
        />
      )}
    </div>
  );
}
