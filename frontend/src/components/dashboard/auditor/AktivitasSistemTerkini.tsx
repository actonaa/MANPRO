import { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  tanggal: string;
  pengguna: {
    nama: string;
    email: string;
  };
  modul: string;
  aksi: string;
  detail: string;
}

export default function AktivitasSistemTerkini() {
  const [data, setData] = useState<
    {
      tanggal: string;
      dinas: string;
      modul: string;
      aksi: string;
      detail: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/audit-logs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json: AuditLog[] = await res.json();

        // Urutkan berdasarkan tanggal terbaru dan ambil 3 data pertama
        const logs = json
          .sort(
            (a, b) =>
              new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
          )
          .slice(0, 3)
          .map((item) => {
            const emailParts = item.pengguna.email.split("@")[1].split(".");
            const dinas = emailParts[0].toUpperCase();

            return {
              tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
              dinas,
              modul: item.modul,
              aksi: item.aksi,
              detail: item.detail,
            };
          });

        setData(logs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
      {/* Judul + Garis Pemisah */}
      <div className="mb-4 border-b-2 border-gray-300 pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Aktivitas Sistem Terkini
        </h2>
      </div>

      {/* Spinner saat loading */}
      {loading ? (
        <div className="flex justify-center items-center h-72">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
