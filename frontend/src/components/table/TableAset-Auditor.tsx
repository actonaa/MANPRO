/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
  dinas?: { name: string };
}

export default function TableAset({ filters }: { filters?: any }) {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // ✅ Dummy data lengkap + filter jalan
  useEffect(() => {
    setTimeout(() => {
      const dummyData: Asset[] = [
        {
          id: "AST-001",
          name: "CCTV Lobby",
          serial_number: "SN-001",
          lokasi: "Kantor Pusat",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Infrastruktur" },
          status: { name: "Aktif" },
          dinas: { name: "Dinas Kesehatan" },
        },
        {
          id: "AST-002",
          name: "Mobil Operasional",
          serial_number: "SN-002",
          lokasi: "Garasi",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Kendaraan" },
          status: { name: "Perbaikan" },
          dinas: { name: "Perhubungan" },
        },
        {
          id: "AST-003",
          name: "Mobil Operasional",
          serial_number: "SN-003",
          lokasi: "Garasi",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Kendaraan" },
          status: { name: "Perbaikan" },
          dinas: { name: "Pendidikan" },
        },
        {
          id: "AST-004",
          name: "Mobil Operasional",
          serial_number: "SN-004",
          lokasi: "Garasi",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Kendaraan" },
          status: { name: "Perbaikan" },
          dinas: { name: "Kesehatan" },
        },
        {
          id: "AST-005",
          name: "Laptop Asus Zenbook",
          serial_number: "SN-005",
          lokasi: "Ruang Server",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Elektronik" },
          status: { name: "Tidak Aktif" },
          dinas: { name: "Dinas TI" },
        },
      ];

      // 🔹 Terapkan filter dari props
      let filtered = [...dummyData];
      if (filters?.kategori)
        filtered = filtered.filter(
          (d) =>
            d.category?.name.toLowerCase() === filters.kategori.toLowerCase()
        );
      if (filters?.status)
        filtered = filtered.filter(
          (d) => d.status?.name.toLowerCase() === filters.status.toLowerCase()
        );
      if (filters?.dinas)
        filtered = filtered.filter(
          (d) => d.dinas?.name.toLowerCase() === filters.dinas.toLowerCase()
        );

      if (filters?.tanggal?.includes("—")) {
        const [start, end] = filters.tanggal
          .split("—")
          .map((t: string) => t.trim())
          .map((t: string) => new Date(t));

        filtered = filtered.filter((d) => {
          const [day, month, year] = d.acquisition_date
            .split(" - ")
            .map((v) => v.trim());
          const formattedDate = new Date(`${year}-${month}-${day}`);
          return formattedDate >= start && formattedDate <= end;
        });
      }

      setData(filtered);
      setLoading(false);
    }, 500);
  }, [filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800";
      case "Perbaikan":
        return "bg-yellow-100 text-yellow-800";
      case "Tidak Aktif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-400 py-5">Memuat data aset...</p>
    );

  if (error) return <p className="text-center py-5 text-red-500">{error}</p>;

  return (
    <div className="lg:rounded-b-xl lg:bg-white">
      {/* 🔹 MOBILE VIEW - Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:hidden space-y-4 mt-5 md:mt-0">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 font-medium">
                  {item.serial_number || "-"}
                </p>
                {/* 🔗 Link ke detail risiko auditor */}
                <a
                  href={`/risiko-auditor/detail`}
                  className="text-[#0095E8] font-medium text-sm hover:underline"
                >
                  Detail
                </a>
              </div>

              <h2 className="text-base font-semibold text-gray-900 mt-1">
                {item.name}
              </h2>

              <hr className="my-3 border-gray-200" />

              <div className="space-y-1 text-sm text-gray-700">
                <p className="flex justify-between">
                  <span className="font-medium">Kategori</span>
                  <span>{item.category?.name || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Lokasi</span>
                  <span>{item.lokasi || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Dinas</span>
                  <span>{item.dinas?.name || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status?.name || ""
                    )}`}
                  >
                    {item.status?.name || "-"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Tanggal Pengajuan</span>
                  <span>{item.acquisition_date || "-"}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Tidak ada data aset tersedia.
          </p>
        )}
      </div>

      {/* 🔹 DESKTOP VIEW - Table Layout */}
      <div className="hidden lg:block overflow-x-auto mt-5 md:mt-0">
        <table className="w-full min-w-[1050px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">DINAS</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PENGAJUAN</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-b-[#ddd] hover:bg-gray-50"
              >
                <td className="py-5 px-4 text-[#333] lg:text-[17px]">
                  {item.serial_number || "-"}
                </td>
                <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                  {item.name}
                </td>
                <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                  {item.category?.name || "-"}
                </td>
                <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                  {item.lokasi || "-"}
                </td>
                <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                  {item.dinas?.name || "-"}
                </td>
                <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                  <span
                    className={`inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
                      item.status?.name || ""
                    )}`}
                    style={{ minWidth: "120px" }}
                  >
                    {item.status?.name || "-"}
                  </span>
                </td>

                <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                  {item.acquisition_date || "-"}
                </td>
                <td className="py-5 px-4">
                  {/* 🔗 Link ke detail risiko auditor */}
                  <a
                    href={`/aset-auditor/detail`}
                    className="text-[#0095E8] font-medium lg:text-[17px] cursor-pointer hover:underline"
                  >
                    detail
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between p-4">
          <p className="text-[13px] text-[#6B7280]">
            Menampilkan {data.length} hasil
          </p>
        </div>
      </div>
    </div>
  );
}
