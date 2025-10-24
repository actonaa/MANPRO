interface Props {
  selectedKategori?: string;
  selectedStatus?: string;
}

export default function TableJadwalPemeliharaan({
  selectedKategori,
  selectedStatus,
}: Props) {
  const data = [
    {
      id: "AST - 001",
      nama: "Laptop Kerja",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Rendah",
      tanggal: "12 - 01 - 2025",
      status: "Aktif",
    },
    {
      id: "AST - 002",
      nama: "CCTV Lobby",
      kategori: "Aset TI",
      lokasi: "Kantor Pusat",
      prioritas: "Tinggi",
      tanggal: "12 - 01 - 2025",
      status: "Perbaikan",
    },
    {
      id: "AST - 003",
      nama: "AC Ruangan",
      kategori: "Aset Fasilitas",
      lokasi: "Kantor Cabang",
      prioritas: "Sedang",
      tanggal: "14 - 02 - 2025",
      status: "Non-Aktif",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      (!selectedKategori || item.kategori === selectedKategori) &&
      (!selectedStatus || item.status === selectedStatus)
  );

  const getBadgeColor = (prioritas: string) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Rendah":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="mt-5 bg-white md:mt-0">
      {/* 💻 TABLE VIEW (Desktop) */}
      <div className="overflow-x-auto hidden lg:block">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">PRIORITAS</th>
              <th className="py-5 px-4 font-semibold">JADWAL PEMELIHARAAN</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-b-[#ddd] hover:bg-gray-50"
                >
                  <td className="py-5 px-4 text-[#333] lg:text-[17px]">
                    {item.id}
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                    {item.nama}
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                    {item.kategori}
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                    {item.lokasi}
                  </td>
                  <td className="py-5 px-4">
                    <span
                      className={`px-5 md:px-7 py-2 rounded-[16px] text-base font-normal ${getBadgeColor(
                        item.prioritas
                      )}`}
                    >
                      {item.prioritas}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                    {item.tanggal}
                  </td>
                  <td className="py-5 px-4">
                    <a
                      href={`/pemeliharaan/detail/jadwal`}
                      className="text-[#0095E8] font-medium lg:text-[17px] cursor-pointer hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-5 text-center text-gray-500 italic"
                >
                  Tidak ada jadwal pemeliharaan tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between p-4">
          <p className="text-[13px] text-[#6B7280]">
            Menampilkan {filteredData.length} hasil
          </p>
        </div>
      </div>

      {/* 📱 CARD VIEW (Mobile & Tablet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500">{item.id}</p>
                <a
                  href={`/pemeliharaan/detail/jadwal`}
                  className="text-[#0095E8] text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>

              {/* Nama aset */}
              <h3 className="font-semibold border-b pb-2 border-gray-300 text-gray-800 text-[15px] mb-3">
                {item.nama}
              </h3>

              {/* Informasi detail 2 kolom */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-700">{item.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="text-gray-700">{item.lokasi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Prioritas</span>
                  <span
                    className={`px-3 py-[2px] text-xs rounded-full font-medium ${getBadgeColor(
                      item.prioritas
                    )}`}
                  >
                    {item.prioritas}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jadwal</span>
                  <span className="text-gray-700">{item.tanggal}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada jadwal pemeliharaan tersedia.
          </p>
        )}
      </div>
    </div>
  );
}
