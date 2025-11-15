type Risiko = {
  id: string;
  namaAset: string;
  namaRisiko: string;
  level: string;
  skor: number;
  kategori: string;
  status: string;
  date: string;
};

const data: Risiko[] = [
  {
    id: "RISK - 001",
    namaAset: "Laptop Kerja",
    namaRisiko: "Kebocoran data",
    level: "Tinggi",
    skor: 20,
    kategori: "IT",
    status: "Aktif",
    date: "2025-01-12",
  },
  {
    id: "RISK - 002",
    namaAset: "CCTV Lobby",
    namaRisiko: "Gangguan Keamanan",
    level: "Sedang",
    skor: 12,
    kategori: "IT",
    status: "Perbaikan",
    date: "2025-01-15",
  },
  {
    id: "RISK - 003",
    namaAset: "Meja",
    namaRisiko: "Permukaan Rusak",
    level: "Rendah",
    skor: 6,
    kategori: "NON-IT",
    status: "Tidak Aktif",
    date: "2025-01-12",
  },
];

const getLevelColor = (level: string) => {
  if (level === "Tinggi") return "text-red-500 font-semibold";
  if (level === "Sedang") return "text-orange-500 font-semibold";
  if (level === "Rendah") return "text-green-500 font-semibold";
  return "text-gray-600";
};

const getStatusStyle = (status: string) => {
  if (status === "Aktif")
    return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium";
  if (status === "Perbaikan")
    return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium";
  if (status === "Tidak Aktif")
    return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium";
  return "text-gray-600";
};

export default function TableRisiko({
  period,
  level,
  status,
}: {
  period?: string;
  level?: string;
  status?: string;
}) {
  const filteredData = data.filter((item) => {
    const matchPeriod = period ? item.date === period : true;
    const matchLevel = level ? item.level === level : true;
    const matchStatus = status ? item.status === status : true;
    return matchPeriod && matchLevel && matchStatus;
  });

  return (
    <div className="rounded-2xl p-2 border border-gray-100">
      {/* 💻 TABLE VIEW — Desktop md ke atas */}
      <div className="hidden md:block rounded-xl bg-white">
        <table className="min-w-full text-sm text-center text-gray-600">
          <thead>
            <tr>
              <th className="py-5 px-4 font-semibold">ID RISIKO</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA RISIKO</th>
              <th className="py-5 px-4 font-semibold">LEVEL</th>
              <th className="py-5 px-4 font-semibold">SKOR</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-5 px-4 font-semibold">{item.id}</td>
                  <td className="py-5 px-4">{item.namaAset}</td>
                  <td className="py-5 px-4">{item.namaRisiko}</td>
                  <td className={`py-5 px-4 ${getLevelColor(item.level)}`}>
                    {item.level}
                  </td>
                  <td className="py-5 px-4">{item.skor}</td>
                  <td className="py-5 px-4">{item.kategori}</td>
                  <td className="py-5 px-4">
                    <span className={getStatusStyle(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <a
                      href={`/risiko/${item.id}`}
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400 italic">
                  Tidak ada data yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD VIEW — Mobile 1 kolom, Tablet 2 kolom */}
      <div className="md:hidden space-y-4">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredData.map((item, i) => (
              <div
                key={i}
                className="border bg-white border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500 font-medium">{item.id}</p>
                  <a
                    href={`/risiko/${item.id}`}
                    className="text-[#0095E8] text-sm font-medium hover:underline"
                  >
                    Detail
                  </a>
                </div>

                <h3 className="font-semibold border-b pb-2 text-gray-800 text-[15px] mb-3">
                  {item.namaAset}
                </h3>

                <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Risiko:</span>{" "}
                    {item.namaRisiko}
                  </p>
                  <p className="text-right">
                    <span className="font-medium text-gray-700">Level:</span>{" "}
                    <span className={getLevelColor(item.level)}>{item.level}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Skor:</span>{" "}
                    {item.skor}
                  </p>
                  <p className="text-right">
                    <span className="font-medium text-gray-700">Kategori:</span>{" "}
                    {item.kategori}
                  </p>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className={getStatusStyle(item.status)}>{item.status}</span>
                  <span className="text-xs text-gray-500">
                    {item.date.split("-").reverse().join("-")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data yang sesuai dengan filter.
          </p>
        )}
      </div>
    </div>
  );
}
