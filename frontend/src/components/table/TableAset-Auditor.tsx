/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
  dinas?: { name: string };
  condition?: string;
}

export default function TableAset({ filters }: { filters?: any }) {
  const [data, setData] = useState<Asset[]>([]);
  const [filteredData, setFilteredData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // 1️⃣ LOAD DUMMY DATA SEKALI
  // ============================
  useEffect(() => {
    setTimeout(() => {
      const dummyData: Asset[] = [
        {
          id: "AST - 001",
          name: "CCTV Lobby",
          serial_number: "AST - 001",
          lokasi: "Kantor Pusat",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Infrastruktur" },
          status: { name: "Aktif" },
          dinas: { name: "DISKOMINFO" },
          condition: "BAIK",
        },
        {
          id: "AST - 002",
          name: "Mobil Operasional",
          serial_number: "AST - 002",
          lokasi: "Garasi",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Kendaraan" },
          status: { name: "End-of-life" },
          dinas: { name: "DISKOMINFO" },
          condition: "RUSAK - BERAT",
        },
        {
          id: "AST - 003",
          name: "Mobil Operasional",
          serial_number: "AST - 003",
          lokasi: "Garasi",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Kendaraan" },
          status: { name: "Akan Dihapus" },
          dinas: { name: "DISKOMINFO" },
          condition: "RUSAK - RINGAN",
        },
        {
          id: "AST - 004",
          name: "Laptop Asus Zenbook",
          serial_number: "AST - 004",
          lokasi: "Ruang Server",
          acquisition_date: "12 - 01 - 2025",
          category: { name: "Elektronik" },
          status: { name: "Perbaikan" },
          dinas: { name: "DISKOMINFO" },
          condition: "RUSAK - BERAT",
        },
      ];

      setData(dummyData);
      setFilteredData(dummyData);
      setLoading(false);
    }, 400);
  }, []);

  // ============================================
  // 2️⃣ JALANKAN FILTER (SEARCH + TANGGAL)
  // ============================================
  useEffect(() => {
    if (loading) return;

    let result = [...data];

    // 🔍 SEARCH
    if (filters?.search) {
      const keyword = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.id.toLowerCase().includes(keyword) ||
          item.serial_number.toLowerCase().includes(keyword) ||
          item.category?.name.toLowerCase().includes(keyword) ||
          item.dinas?.name.toLowerCase().includes(keyword) ||
          item.lokasi.toLowerCase().includes(keyword)
      );
    }

    // 📅 TANGGAL
    if (filters?.tanggal?.start && filters?.tanggal?.end) {
      const start = new Date(filters.tanggal.start);
      const end = new Date(filters.tanggal.end);

      result = result.filter((d) => {
        const [day, month, year] = d.acquisition_date
          .split(" - ")
          .map((v) => v.trim());
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate >= start && formattedDate <= end;
      });
    }

    setFilteredData(result);
  }, [filters, data, loading]);

  // =====================================================
  // STYLE BADGES
  // =====================================================
  const getConditionColor = (v: string) => {
    switch (v) {
      case "BAIK":
        return "text-green-600 font-semibold";
      case "RUSAK - RINGAN":
        return "text-yellow-600 font-semibold";
      case "RUSAK - BERAT":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Aktif":
        return "bg-green-100 text-green-700";
      case "End-of-life":
        return "bg-red-100 text-red-700";
      case "Akan Dihapus":
      case "Perbaikan":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="text-center py-5">Memuat data aset...</p>;

  return (
    <div className="lg:rounded-b-xl lg:bg-white">
      {/* 📱 MOBILE VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:hidden space-y-4 mt-5">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white relative"
          >
            {/* ICON CHAT */}
            <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100">
              <MessageCircleMore className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex justify-between items-center pr-10">
              <p className="text-sm text-gray-500 font-medium">
                {item.serial_number}
              </p>

              <a
                href="/aset-auditor/detail"
                className="text-[#0095E8] font-medium text-sm hover:underline"
              >
                Detail
              </a>
            </div>

            <h2 className="text-base font-semibold text-gray-900 mt-1 pr-10">
              {item.name}
            </h2>

            <hr className="my-3" />

            <div className="space-y-1 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>Kategori</span> <span>{item.category?.name}</span>
              </p>
              <p className="flex justify-between">
                <span>Lokasi</span> <span>{item.lokasi}</span>
              </p>
              <p className="flex justify-between">
                <span>Dinas</span> <span>{item.dinas?.name}</span>
              </p>
              <p className="flex justify-between">
                <span>Kondisi</span>
                <span className={getConditionColor(item.condition || "")}>
                  {item.condition}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    item.status?.name || ""
                  )}`}
                >
                  {item.status?.name}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Tanggal Pengajuan</span>{" "}
                <span>{item.acquisition_date}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🖥 DESKTOP VIEW */}
      <div className="hidden lg:block overflow-x-auto mt-5">
        <table className="w-full min-w-[1100px] text-center text-[13px] border-collapse">
          <thead className="text-gray-600">
            <tr>
              <th className="py-5 px-4">DINAS</th>
              <th className="py-5 px-4">ID ASET</th>
              <th className="py-5 px-4">NAMA ASET</th>
              <th className="py-5 px-4">KATEGORI</th>
              <th className="py-5 px-4">LOKASI</th>
              <th className="py-5 px-4">KONDISI</th>
              <th className="py-5 px-4">STATUS</th>
              <th className="py-5 px-4">TANGGAL</th>
              <th className="py-5 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-5 px-4">{item.dinas?.name}</td>
                <td className="py-5 px-4">{item.id}</td>
                <td className="py-5 px-4">{item.name}</td>
                <td className="py-5 px-4">{item.category?.name}</td>
                <td className="py-5 px-4">{item.lokasi}</td>
                <td className="py-5 px-4">
                  <span className={getConditionColor(item.condition || "")}>
                    {item.condition}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      item.status?.name || ""
                    )}`}
                  >
                    {item.status?.name}
                  </span>
                </td>
                <td className="py-5 px-4">{item.acquisition_date}</td>
                <td className="py-5 px-4">
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href="/aset-auditor/detail"
                      className="text-[#0095E8] font-medium hover:underline"
                    >
                      Detail
                    </a>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MessageCircleMore className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
