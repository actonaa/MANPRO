type TablePemeliharaanProps = {
  kategori?: string;
  tanggal?: string;
};

export default function TablePemeliharaan({
  kategori = "",
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
    },
    {
      idAset: "AST - 002",
      idLaporan: "LAP - 002",
      jenis: "Insidental",
      biaya: "Rp10.000.000,00",
      vendor: "Service Desk",
      realisasi: "12 - 01 - 2025",
    },
    {
      idAset: "AST - 003",
      idLaporan: "LAP - 003",
      jenis: "Insidental",
      biaya: "Rp8.000.000,00",
      vendor: "PT Teknologi Nusantara",
      realisasi: "10 - 02 - 2025",
    },
  ];

  // 🔍 Filter data
  const filteredData = data.filter((row) => {
    const matchKategori = kategori ? row.jenis === kategori : true;
    const matchTanggal = tanggal ? row.realisasi.includes(tanggal) : true;
    return matchKategori && matchTanggal;
  });

  return (
    <>
      {/* 💻 TABLE VIEW — hanya tampil di layar besar (lg ke atas) */}
      <div className="hidden lg:block bg-white overflow-x-auto md:rounded-b-xl ">
        <table className="w-full text-sm text-left border-spacing-y-3">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-7">ID ASET</th>
              <th className="px-6 py-7">ID LAPORAN</th>
              <th className="px-6 py-7">JENIS</th>
              <th className="px-6 py-7">BIAYA</th>
              <th className="px-6 py-7">VENDOR</th>
              <th className="px-6 py-7">REALISASI</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-7">{row.idAset}</td>
                  <td className="px-6 py-7">{row.idLaporan}</td>
                  <td className="px-6 py-7">{row.jenis}</td>
                  <td className="px-6 py-7">{row.biaya}</td>
                  <td className="px-5 py-7">{row.vendor}</td>
                  <td className="px-6 py-7">{row.realisasi}</td>
                  <td className="px-6 py-7 text-right">
                    <a
                      href={`/laporan/pemeliharaan/detail`}
                      className="text-[#0095E8] font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-400 italic"
                >
                  Tidak ada data yang cocok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD VIEW — tampil di mobile & tablet */}
      <div className="block lg:hidden">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredData.map((row, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                {/* Header Card */}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {row.idAset}
                  </p>
                  <a
                    href={`/laporan/pemeliharaan/detail`}
                    className="text-[#0095E8] text-sm font-medium hover:underline"
                  >
                    Detail
                  </a>
                </div>

                {/* Vendor Info */}
                <h3 className="font-semibold text-gray-800 text-[15px] mb-3 border-b pb-2">
                  {row.vendor}
                </h3>
                <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Kategori:</span>{" "}
                    {row.jenis}
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
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data yang cocok.
          </p>
        )}
      </div>
    </>
  );
}
