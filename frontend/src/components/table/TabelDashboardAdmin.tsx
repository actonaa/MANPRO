interface DinasData {
  dinas: string;
  verifikasi: string;
  risiko: number;
  kepatuhan: string;
}

interface TabelDashboardAdminProps {
  data: DinasData[];
}

export default function TabelDashboardAdmin({
  data,
}: TabelDashboardAdminProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Tabel Performa Dinas
      </h2>

      <table className="min-w-full border-collapse w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-200 uppercase">
            <th className="py-3 px-4 font-semibold tracking-wide">DINAS</th>
            <th className="py-3 px-4 font-semibold tracking-wide">
              DATA ASET TERVERIFIKASI
            </th>
            <th className="py-3 px-4 font-semibold tracking-wide">
              RISIKO AKTIF
            </th>
            <th className="py-3 px-4 font-semibold tracking-wide">
              KEPATUHAN PEMELIHARAAN
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-gray-900 text-sm font-medium"
            >
              <td className="py-3 px-4">{item.dinas}</td>
              <td className="py-3 px-4">{item.verifikasi}</td>
              <td className="py-3 px-4">{item.risiko}</td>
              <td className="py-3 px-4">{item.kepatuhan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
