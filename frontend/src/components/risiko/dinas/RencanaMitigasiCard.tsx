import ButtonCard from "../../button/Button";
import { useNavigate } from "react-router-dom";

export default function RencanaMitigasiCard() {
  const navigate = useNavigate(); // ✅ inisialisasi navigasi

  return (
    <div className="bg-white  rounded-lg border border-white mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Rencana Mitigasi</h2>

      <table className="w-full text-sm text-left border-collapse mb-6">
        <thead className="border-b">
          <tr>
            <th className="py-2 font-bold text-gray-600">Aksi</th>
            <th className="py-2 font-bold text-gray-600">Status</th>
            <th className="py-2 font-bold text-gray-600">Target Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-bold text-gray-800">
              Meningkatkan keamanan sistem.
            </td>
            <td className="font-bold">
              <span className="bg-blue-100 text-blue-700  px-3 py-1 rounded-full text-sm font-bold">
                Dalam proses
              </span>
            </td>
            <td className="font-bold text-gray-800">10-10-2025</td>
          </tr>
          <tr>
            <td className="py-2 font-bold text-gray-800">
              Meningkatkan keamanan sistem.
            </td>
            <td className="font-bold">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                Belum diproses
              </span>
            </td>
            <td className="font-bold text-gray-800">10-10-2025</td>
          </tr>
        </tbody>
      </table>

      {/* ✅ Tombol sekarang redirect ke /edit-risiko */}
      <div className="md:flex md:justify-center md:items-center">
        <ButtonCard
          title="+ Tambah Aksi"
          color="#007DFA"
          hoverColor="#0066cc"
          textColor="#ffffff"
          borderColor="#007DFA"
          onClick={() => navigate("/edit-risiko")} // ✅ klik redirect
        />
      </div>
    </div>
  );
}
