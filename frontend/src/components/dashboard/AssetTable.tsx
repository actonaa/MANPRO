export default function AssetTable() {
  const assets = [
    {
      id: "001",
      nama: "Laptop",
      kategori: "Elektronik",
      lokasi: "R. TU",
      status: "Aktif",
    },
    {
      id: "002",
      nama: "Server Dinas",
      kategori: "Jaringan",
      lokasi: "Data Center",
      status: "Perbaikan",
    },
    {
      id: "003",
      nama: "Kursi Kerja",
      kategori: "Furnitur",
      lokasi: "R. Kabid",
      status: "Tidak Aktif",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-sm font-semibold mb-3">Data Aset Dinas</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              {[
                "ID Aset",
                "Nama Aset",
                "Kategori",
                "Lokasi",
                "Status",
                "Aksi",
              ].map((head) => (
                <th key={head} className="p-2 text-center">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.nama}</td>
                <td className="p-2">{item.kategori}</td>
                <td className="p-2">{item.lokasi}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Aktif"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Perbaikan"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
