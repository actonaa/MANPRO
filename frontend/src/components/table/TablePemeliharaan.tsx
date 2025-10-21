type TablePemeliharaanProps = {
  kategori?: string;
  status?: string;
  tanggal?: string;
};

export default function TablePemeliharaan({
  kategori = "",
  status = "",
  tanggal = "",
}: TablePemeliharaanProps) {
  const data = [
    {
      idAset: "AST - 001",
      idLaporan: "LAP - 001",
      jenis: "Terjadwal",
      biaya: "Rp5.000.000,00",
      vendor: "Service Desk",
      realisasi: "12 - 01 - 2025",
      status: "Selesai",
    },
    {
      idAset: "AST - 002",
      idLaporan: "LAP - 002",
      jenis: "Insidental",
      biaya: "Rp10.000.000,00",
      vendor: "Service Desk",
      realisasi: "12 - 01 - 2025",
      status: "Berlangsung",
    },
    {
      idAset: "AST - 003",
      idLaporan: "LAP - 003",
      jenis: "Insidental",
      biaya: "Rp8.000.000,00",
      vendor: "PT Teknologi Nusantara",
      realisasi: "10 - 02 - 2025",
      status: "Dibatalkan",
    },
  ];

  // Filter data
  const filteredData = data.filter((row) => {
    const matchKategori = kategori ? row.jenis === kategori : true;
    const matchStatus = status ? row.status === status : true;
    const matchTanggal = tanggal ? row.realisasi.includes(tanggal) : true;
    return matchKategori && matchStatus && matchTanggal;
  });

  return (
    <>
      {/* 💻 TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border-spacing-y-3">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">ID ASET</th>
              <th className="px-6 py-3">ID LAPORAN</th>
              <th className="px-6 py-3">JENIS</th>
              <th className="px-6 py-3">BIAYA</th>
              <th className="px-6 py-3">VENDOR</th>
              <th className="px-6 py-3">REALISASI</th>
              <th className="px-6 py-3">STATUS</th>
              <th className="px-6 py-3 text-right">DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-3">{row.idAset}</td>
                  <td className="px-6 py-3">{row.idLaporan}</td>
                  <td className="px-6 py-3">{row.jenis}</td>
                  <td className="px-6 py-3">{row.biaya}</td>
                  <td className="px-6 py-3">{row.vendor}</td>
                  <td className="px-6 py-3">{row.realisasi}</td>
                  <td className="px-6 py-3">{row.status}</td>
                  <td className="px-6 py-3 text-right text-blue-600 cursor-pointer">
                    Detail
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400 italic">
                  Tidak ada data yang cocok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD VIEW */}
      <div className="md:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((row, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500">{row.idAset}</p>
                <a
                  href="#"
                  className="text-[#0095E8] text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>

              <h3 className="font-semibold border-b pb-2 text-gray-800 text-[15px] mb-3">
                {row.vendor}
              </h3>

              <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Kategori:</span>{" "}
                  {row.jenis}
                </p>
                <p className="text-right">
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  {row.status}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Biaya:</span>{" "}
                  {row.biaya}
                </p>
                <p className="text-right">
                  <span className="font-medium text-gray-700">Jadwal:</span>{" "}
                  {row.realisasi}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data yang cocok.
          </p>
        )}
      </div>
    </>
  );
}
