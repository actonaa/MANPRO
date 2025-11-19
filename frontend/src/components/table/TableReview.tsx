export default function TableReview({ filters }: any) {
  const data = [
    {
      date: "10/24/2025 - 10:45",
      dinas: "DISKOMINFO",
      idAset: "AST - 001",
      namaAset: "Asus Zenbook",
      risiko: "Perbarui",
      rekomendasi: "Perlu pengawasan lebih ketat",
    },
    {
      date: "10/24/2025 - 10:45",
      dinas: "DISNAKER",
      idAset: "AST - 002",
      namaAset: "Meja",
      risiko: "Tambah",
      rekomendasi: "Rutin melakukan pemeliharaan",
    },
    {
      date: "10/24/2025 - 10:45",
      dinas: "DISBUDPORA",
      idAset: "AST - 003",
      namaAset: "Kendaraan Operasional",
      risiko: "Hapus",
      rekomendasi: "Pembaruan asuransi tepat waktu",
    },
  ];

  const filtered = data.filter((item) => {
    const s = filters.search.toLowerCase();
    return (
      item.idAset.toLowerCase().includes(s) ||
      item.namaAset.toLowerCase().includes(s) ||
      item.dinas.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Aktivitas Sistem Terkini
      </h2>

      {/* DESKTOP */}
      <div className="hidden xl:block">
        <table className="w-full min-w-[1100px] text-[14px] text-left border-collapse">
          <thead className="text-gray-500 border-b border-[#E5E7EB]">
            <tr>
              <th className="py-4">Tanggal & Waktu</th>
              <th className="py-4">DINAS</th>
              <th className="py-4">ID ASET</th>
              <th className="py-4">NAMA ASET</th>
              <th className="py-4">Risiko</th>
              <th className="py-4 w-[300px]">Rekomendasi</th>
            </tr>
          </thead>

          <tbody className="text-gray-600">
            {filtered.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-[#E5E7EB] hover:bg-gray-50"
              >
                <td className="py-5">{item.date}</td>
                <td className="py-5">{item.dinas}</td>
                <td className="py-5">{item.idAset}</td>
                <td className="py-5">{item.namaAset}</td>
                <td className="py-5">{item.risiko}</td>
                <td className="py-5">{item.rekomendasi}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center text-sm text-gray-500 px-2 mt-4">
          <p>Menampilkan 1 dari 5 hasil</p>

          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-gray-400 hover:text-black">
              {"<"}
            </button>

            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`px-3 py-1 rounded-md ${
                  n === 1 ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button className="px-2 py-1 text-gray-400 hover:text-black">
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="grid grid-cols-1 gap-4 xl:hidden mt-2">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.date}</p>

            <div className="mt-2 text-gray-700 space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">Dinas</span>
                <span className="font-medium">{item.dinas}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-500">ID Aset</span>
                <span className="font-medium">{item.idAset}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-500">Nama Aset</span>
                <span className="font-medium">{item.namaAset}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-500">Risiko</span>
                <span className="font-medium">{item.risiko}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-500">Rekomendasi</span>
                <span className="font-medium text-right w-[55%]">
                  {item.rekomendasi}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
