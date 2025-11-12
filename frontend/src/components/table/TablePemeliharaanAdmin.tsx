type TablePemeliharaanProps = {
  kategori?: string;
  status?: string;
  tanggal?: string;
};

export default function TablePemeliharaanAdmin({
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

  // 🔍 Filter data
  const filteredData = data.filter((row) => {
    const matchKategori = kategori ? row.jenis === kategori : true;
    const matchStatus = status ? row.status === status : true;
    const matchTanggal = tanggal ? row.realisasi.includes(tanggal) : true;
    return matchKategori && matchStatus && matchTanggal;
  });

  return (
    <>
      {/* 💻 TABLE VIEW — tampil di layar besar */}
      <div className="hidden lg:block bg-white overflow-x-auto rounded-b-xl">
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
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5">{row.idAset}</td>
                  <td className="px-6 py-5">{row.idLaporan}</td>
                  <td className="px-6 py-5">{row.jenis}</td>
                  <td className="px-6 py-5">{row.biaya}</td>
                  <td className="px-6 py-5">{row.vendor}</td>
                  <td className="px-6 py-5">{row.realisasi}</td>
                  <td className="px-6 py-5">{row.status}</td>
                  <td className="px-6 py-5 text-right">
                    <a
                      href={`/detail/laporan`}
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
                    href={`/detail/laporan`}
                    className="text-[#0095E8] text-sm font-medium hover:underline"
                  >
                    Detail
                  </a>
                </div>

                {/* Vendor Info */}
                <h3 className="font-semibold text-gray-800 text-[15px] mb-3 border-b pb-2">
                  {row.vendor}
                </h3>

                {/* Content */}
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Kategori:</span>
                    <span>{row.jenis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`${
                        row.status === "Selesai"
                          ? "text-green-600"
                          : row.status === "Berlangsung"
                          ? "text-blue-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Biaya:</span>
                    <span>{row.biaya}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Realisasi:</span>
                    <span>{row.realisasi}</span>
                  </div>
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
