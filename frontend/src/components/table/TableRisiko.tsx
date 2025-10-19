import { useState, useEffect } from "react";

type TableRisikoProps = {
  searchTerm?: string;
  selectedStatus?: string;
  selectedKategori?: string;
};

type RisikoItem = {
  id: string;
  title: string;
  type: string;
  criteria: string;
  priority: string;
  status: string;
  entry_level: number;
  asset: { name: string; lokasi: string };
  department: { name: string };
};

export default function TableRisiko({
  searchTerm = "",
  selectedStatus = "",
  selectedKategori = "",
}: TableRisikoProps) {
  const [data, setData] = useState<RisikoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisiko = async () => {
      try {
        const token = localStorage.getItem("token"); // ambil token dari localStorage

        const res = await fetch("/api/risks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // sertakan token
          },
        });

        if (!res.ok) throw new Error("Gagal memuat data risiko");

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisiko();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "High":
      case "Tinggi":
        return "bg-red-100 text-red-600";
      case "Medium":
      case "Sedang":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
      case "Rendah":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "Dalam Proses":
        return "bg-blue-100 text-blue-600";
      case "approved":
      case "Diterima":
        return "bg-green-100 text-green-600";
      case "rejected":
      case "Ditolak":
        return "bg-gray-300 text-gray-900";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Filter data berdasarkan pencarian, status, dan kategori
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus
      ? item.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    const matchesKategori = selectedKategori
      ? item.type.toLowerCase() === selectedKategori.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesKategori;
  });

  if (loading) {
    return <p className="text-center text-gray-500 py-6">Memuat data...</p>;
  }

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
              <td className="py-5 px-4 text-[#333] font-semibold">
                {item.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="py-5 px-4 text-[#666] font-medium">
                {item.asset?.name}
              </td>
              <td className="py-5 px-4 text-[#666] font-medium">{item.title}</td>
              <td className="py-5 px-4 text-[#666] font-medium">{item.type}</td>
              <td className="py-5 px-4">
                <span
                  className={`px-5 py-2 rounded-[16px] text-sm font-medium ${getLevelColor(
                    item.criteria
                  )}`}
                >
                  {item.criteria}
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
                {item.priority}
              </td>
              <td className="py-5 px-4 text-[#666] font-medium">
                {item.entry_level}
              </td>
              <td className="py-5 px-4">
                <a
                  href={`/risiko/${item.id}`}
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
