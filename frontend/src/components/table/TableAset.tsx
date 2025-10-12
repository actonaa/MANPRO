export default function TableAset() {
  const data = [
    {
      id: "AST - 001",
      name: "CCTV Lobby",
      category: "Infrastruktur",
      location: "Kantor Pusat",
      status: "Aktif",
      date: "12 - 01 - 2025",
    },
    {
      id: "AST - 002",
      name: "Mobil Operasional",
      category: "Kendaraan",
      location: "Garasi",
      status: "Perbaikan",
      date: "12 - 01 - 2025",
    },
    {
      id: "AST - 003",
      name: "Laptop Asus Zenbook",
      category: "Elektronik",
      location: "Ruang Server",
      status: "Tidak Aktif",
      date: "12 - 01 - 2025",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-[#BBF7D0] text-[#166534] px-11";
      case "Perbaikan":
        return "bg-yellow-200 text-yellow-800";
      case "Tidak Aktif":
        return "bg-red-200 text-red-800 md:px-5";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
        <thead className="text-[#666666]">
          <tr>
            <th className="py-5 px-4 font-semibold">ID ASET</th>
            <th className="py-5 px-4 font-semibold">NAMA ASET</th>
            <th className="py-5 px-4 font-semibold">KATEGORI</th>
            <th className="py-5 px-4 font-semibold">LOKASI</th>
            <th className="py-5 px-4 font-semibold">Status</th>
            <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
            <th className="py-5 px-4 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-b-[#ddd] hover:bg-gray-50"
            >
              <td className="py-5 px-4 text-[#333] font-semibold lg:text-[17px]">
                {item.id}
              </td>
              <td className="py-5 px-4 text-[#666] font-semibold lg:text-[17px]">
                {item.name}
              </td>
              <td className="py-5 px-4 text-[#666] font-semibold lg:text-[17px]">
                {item.category}
              </td>
              <td className="py-5 px-4 text-[#666] font-semibold lg:text-[17px]">
                {item.location}
              </td>
              <td className="py-5 px-4 text-[#666] font-semibold lg:text-[17px]">
                <span
                  className={`px-7 py-2 rounded-[16px] text-base font-normal ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-5 px-4 text-[#666] font-semibold lg:text-[17px]">
                {item.date}
              </td>
              <td className="py-5 px-4 text-[#0095E8] font-medium cursor-pointer hover:underline">
                Lihat
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between p-4">
        <p className="text-[13px] text-[#6B7280]">Menampilkan 1 dari 5 hasil</p>
      </div>
    </div>
  );
}
