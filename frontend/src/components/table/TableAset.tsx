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
}

export default function TableAset() {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/assets", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error(
              "Unauthorized — Token tidak valid atau kadaluarsa."
            );
          }
          throw new Error(`Gagal mengambil data (${res.status})`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Gagal memuat data aset:", err);
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-[#BBF7D0] text-[#166534] md:px-10 px-7";
      case "Perbaikan":
        return "bg-yellow-200 text-yellow-800";
      case "Non-Aktif":
      case "Tidak Aktif":
        return "bg-red-200 text-red-800 md:px-5 md:text-nowrap";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="mt-5 md:mt-0">
        {/* 🔹 MOBILE VIEW Skeleton */}
        <div className="block lg:hidden space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white animate-pulse"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-10 bg-gray-200 rounded"></div>
              </div>

              <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
              <hr className="my-3 border-gray-200" />

              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-3 w-28 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 DESKTOP VIEW Skeleton */}
        <div className="hidden lg:block overflow-x-auto bg-white">
          <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
            <thead className="text-[#666666]">
              <tr>
                <th className="py-5 px-4 font-semibold">ID ASET</th>
                <th className="py-5 px-4 font-semibold">NAMA ASET</th>
                <th className="py-5 px-4 font-semibold">KATEGORI</th>
                <th className="py-5 px-4 font-semibold">LOKASI</th>
                <th className="py-5 px-4 font-semibold">STATUS</th>
                <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
                <th className="py-5 px-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-b-[#ddd] animate-pulse">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="py-5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex justify-between p-4">
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
          </div>
        </div>
      </div>
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
                <a
                  href={`/aset/${item.id}`}
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
                  <p className="font-medium">Kategori </p>
                  <p>{item.category?.name || "-"}</p>
                </p>
                <p className="flex justify-between">
                  <p className="font-medium">Lokasi </p>
                  <p>{item.lokasi || "-"}</p>
                </p>
                <p className="flex justify-between">
                  <p className="font-medium">Status </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status?.name || ""
                    )}`}
                  >
                    <p>{item.status?.name || "-"}</p>
                  </span>
                </p>
                <p className="flex justify-between">
                  <p className="font-medium">Tanggal</p>
                  <p>{item.acquisition_date || "-"}</p>
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

      {/* 🔹 DESKTOP VIEW - Table Layout (Tidak Diubah) */}
      <div className="hidden lg:block overflow-x-auto mt-5 md:mt-0">
        <table className="w-full min-w-[800px] text-[13px] text-center border-collapse">
          <thead className="text-[#666666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">STATUS</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
              <th className="py-5 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-[#ddd] hover:bg-gray-50"
                >
                  <td className="py-5 px-4 text-[#333]  lg:text-[17px]">
                    {item.serial_number || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]  lg:text-[17px]">
                    {item.name}
                  </td>
                  <td className="py-5 px-4 text-[#666]  lg:text-[17px]">
                    {item.category?.name || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]  lg:text-[17px]">
                    {item.lokasi || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]  lg:text-[17px]">
                    <span
                      className={`px-5 md:px-7 py-2 rounded-[16px] text-base font-normal ${getStatusColor(
                        item.status?.name || ""
                      )}`}
                    >
                      {item.status?.name || "-"}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#666]  lg:text-[17px]">
                    {item.acquisition_date || "-"}
                  </td>
                  <td className="py-5 px-4">
                    <a
                      href={`/aset/${item.id}`}
                      className="text-[#0095E8] font-medium  lg:text-[17px] cursor-pointer hover:underline"
                    >
                      detail
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
                  Tidak ada data aset tersedia.
                </td>
              </tr>
            )}
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
