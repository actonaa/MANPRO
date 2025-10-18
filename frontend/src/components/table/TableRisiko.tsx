type TableRisikoProps = {
  searchTerm?: string;
  selectedStatus?: string;
  selectedKategori?: string;
};

export default function TableRisiko({
  searchTerm = "",
  selectedStatus = "",
  selectedKategori = "",
}: TableRisikoProps) {
  const data = [
    {
      id: "RSK001",
      aset: "Server Utama",
      risiko: "Gangguan Sistem",
      tipe: "Operasional",
      level: "Tinggi",
      status: "Dalam Proses",
      kategori: "TI",
      skor: 85,
    },
    {
      id: "RSK002",
      aset: "Gedung A",
      risiko: "Kebakaran",
      tipe: "Fisik",
      level: "Sedang",
      status: "Diterima",
      kategori: "NON-TI",
      skor: 70,
    },
    {
      id: "RSK003",
      aset: "Database",
      risiko: "Kehilangan Data",
      tipe: "Teknologi",
      level: "Tinggi",
      status: "Ditolak",
      kategori: "TI",
      skor: 90,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Sedang":
        return "bg-yellow-100 text-yellow-600";
      case "Rendah":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dalam Proses":
        return "bg-blue-100 text-blue-600";
      case "Diterima":
        return "bg-green-100 text-green-600";
      case "Ditolak":
        return "bg-gray-300 text-gray-900";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Filter berdasarkan pencarian, status, kategori
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.risiko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;
    const matchesKategori = selectedKategori
      ? item.kategori === selectedKategori
      : true;

    return matchesSearch && matchesStatus && matchesKategori;
  });

  return (
    <div className="overflow-x-auto md:pb-10">
      <table className="w-full min-w-[900px] text-[13px] text-center border-collapse">
        <thead className="text-[#666666] border-b border-[#ddd]">
          <tr>
            <th className="py-5 px-4 font-semibold">ID RISIKO</th>
            <th className="py-5 px-4 font-semibold">NAMA ASET</th>
            <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
            <th className="py-5 px-4 font-semibold">TIPE</th>
            <th className="py-5 px-4 font-semibold">LEVEL</th>
            <th className="py-5 px-4 font-semibold">STATUS</th>
            <th className="py-5 px-4 font-semibold">KATEGORI</th>
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
              <td className="py-5 px-4 text-[#333] font-semibold">{item.id}</td>
              <td className="py-5 px-4 text-[#666] font-medium">{item.aset}</td>
              <td className="py-5 px-4 text-[#666] font-medium">
                {item.risiko}
              </td>
              <td className="py-5 px-4 text-[#666] font-medium">{item.tipe}</td>
              <td className="py-5 px-4">
                <span
                  className={`px-5 py-2 rounded-[16px] text-sm font-medium ${getLevelColor(
                    item.level
                  )}`}
                >
                  {item.level}
                </span>
              </td>
              <td className="py-5 px-4">
                <span
                  className={`px-5 py-2 rounded-[16px] text-sm font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-5 px-4 text-[#666] font-medium">
                {item.kategori}
              </td>
              <td className="py-5 px-4 text-[#666] font-medium">{item.skor}</td>
              <td className="py-5 px-4">
                <a
                  href="/risiko/detail"
                  className="text-[#0095E8] font-medium cursor-pointer hover:underline"
                >
                  Detail
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          Tidak ada data yang cocok.
        </p>
      )}
    </div>
  );
}
