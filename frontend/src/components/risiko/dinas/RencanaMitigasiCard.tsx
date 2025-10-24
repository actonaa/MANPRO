import { useNavigate } from "react-router-dom";
import ButtonImg from "../../button/ButtonImg";
import ButtonCard from "../../button/Button";

type Mitigasi = {
  aksi: string;
  status: string;
  targetTanggal: string;
  strategi: string;
  biaya: string;
  pemilik: string;
  efektivitas: string;
  nilaiProbabilitas: number;
  nilaiDampak: number;
  nilaiResidual: number;
};

type RencanaMitigasiCardProps = {
  mitigasiList?: Mitigasi[];
  showAddButton?: boolean; // ✅ Tambahkan prop opsional ini
};

export default function RencanaMitigasiCard({
  mitigasiList = [],
  showAddButton = true, // ✅ Default: tombol tetap muncul
}: RencanaMitigasiCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/aset/tambah");
  };

  // 🎨 Warna badge status
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("selesai"))
      return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("proses"))
      return "bg-blue-100 text-blue-700";
    if (status.toLowerCase().includes("belum"))
      return "bg-gray-200 text-gray-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2 md:mb-0">
          Rencana Mitigasi
        </h2>

        <ButtonImg
          title="Tambah Aksi"
          img="/kelola-asset/tambah-asset.png"
          color="#00a9ff"
          hoverColor="#a0e9ff"
          borderColor="#00a9ff"
          textColor="white"
          px="2"
          fontWeight="font-medium"
          wFull="w-40"
          paddingY="py-0"
          onClick={handleNavigate}
        />
      </div>

      {/* Tabel */}
      {mitigasiList.length > 0 ? (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="border-b text-gray-600">
            <tr>
              <th className="py-2 font-bold">Aksi</th>
              <th className="py-2 font-bold">Status</th>
              <th className="py-2 font-bold">Target Tanggal</th>
              <th className="py-2 font-bold">Strategi</th>
              <th className="py-2 font-bold">Biaya</th>
              <th className="py-2 font-bold">Pemilik</th>
              <th className="py-2 font-bold">Efektivitas</th>
              <th className="py-2 font-bold">Nilai Probabilitas</th>
              <th className="py-2 font-bold">Nilai Dampak</th>
              <th className="py-2 font-bold">Nilai Residual</th>
            </tr>
          </thead>
          <tbody>
            {mitigasiList.map((item) => (
              <tr className="border-b">
                <td className="py-2 text-gray-800 font-medium">{item.aksi}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 font-medium text-gray-800">
                  {item.targetTanggal}
                </td>
                <td className="py-2 font-medium text-gray-800">
                  {item.strategi}
                </td>
                <td className="py-2 font-medium text-gray-800">{item.biaya}</td>
                <td className="py-2 font-medium text-gray-800">
                  {item.pemilik}
                </td>
                <td className="py-2 font-medium text-gray-800">
                  {item.efektivitas}
                </td>
                <td className="py-2 font-medium text-gray-800 text-center">
                  {item.nilaiProbabilitas}
                </td>
                <td className="py-2 font-medium text-gray-800 text-center">
                  {item.nilaiDampak}
                </td>
                <td className="py-2 font-medium text-gray-800 text-center">
                  {item.nilaiResidual}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 italic">
          Belum ada rencana mitigasi ditambahkan.
        </p>
      )}
      {/* 🔘 Tombol Tambah (hanya tampil jika showAddButton = true) */}
      {showAddButton && (
        <div className="md:flex md:justify-center md:items-center">
          <ButtonCard
            title="+ Tambah Aksi"
            color="#007DFA"
            hoverColor="#0066cc"
            textColor="#ffffff"
            borderColor="#007DFA"
            onClick={() => navigate("/edit-risiko")}
          />
        </div>
      )}
    </div>
  );
}
