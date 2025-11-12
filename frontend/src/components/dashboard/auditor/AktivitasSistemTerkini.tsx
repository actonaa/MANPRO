export default function AktivitasSistemTerkini() {
  const data = [
    {
      tanggal: "12 - 01 - 2025",
      dinas: "DISKOMINFO",
      modul: "Aset",
      aksi: "Perbarui",
      detail: "Aksi INSERT pada sumber daya user_auth_devices",
    },
    {
      tanggal: "12 - 01 - 2025",
      dinas: "DISNAKER",
      modul: "Risiko",
      aksi: "Tambah",
      detail: "Aksi UPDATE pada sumber daya permissions",
    },
    {
      tanggal: "12 - 01 - 2025",
      dinas: "DISDUKCAPIL",
      modul: "Aset",
      aksi: "Hapus",
      detail: "Aksi DELETE pada sumber daya users",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
      {/* Judul + Garis Pemisah */}
      <div className="mb-4 border-b-2 border-gray-300 pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Aktivitas Sistem Terkini
        </h2>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-center">
              <th className="py-2 px-4">Tanggal</th>
              <th className="py-2 px-4">NAMA DINAS</th>
              <th className="py-2 px-4">MODUL</th>
              <th className="py-2 px-4">AKSI</th>
              <th className="py-2 px-4">DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition text-center"
              >
                <td className="py-3 px-4">{item.tanggal}</td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  {item.dinas}
                </td>
                <td className="py-3 px-4">{item.modul}</td>
                <td className="py-3 px-4 text-gray-700">{item.aksi}</td>
                <td className="py-3 px-4 text-gray-600">{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
