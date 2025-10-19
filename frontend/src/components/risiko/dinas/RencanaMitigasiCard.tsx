import ButtonCard from "../../button/Button";
import { useNavigate } from "react-router-dom";

type Mitigasi = {
  id: string;
  aksi: string;
  status: string;
  targetTanggal: string;
};

type RencanaMitigasiCardProps = {
  mitigasiList?: Mitigasi[];
};

export default function RencanaMitigasiCard({
  mitigasiList = [],
}: RencanaMitigasiCardProps) {
  const navigate = useNavigate();

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
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Rencana Mitigasi</h2>

      {mitigasiList.length > 0 ? (
        <table className="w-full text-sm text-left border-collapse mb-6">
          <thead className="border-b">
            <tr>
              <th className="py-2 font-bold text-gray-600">Aksi</th>
              <th className="py-2 font-bold text-gray-600">Status</th>
              <th className="py-2 font-bold text-gray-600">Target Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {mitigasiList.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 font-bold text-gray-800">{item.aksi}</td>
                <td className="font-bold">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="font-bold text-gray-800">
                  {item.targetTanggal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 italic mb-6">
          Belum ada rencana mitigasi ditambahkan.
        </p>
      )}

      {/* 🔘 Tombol Tambah */}
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
    </div>
  );
}
