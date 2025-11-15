// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    XLSX: any;
  }
}

import { useEffect, useState } from "react";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
  status_perolehan?: string;
}

export default function TableAset({
  selectedKategori,
  selectedStatus,
  searchValue,
}: {
  selectedKategori?: string;
  selectedStatus?: string;
  searchValue?: string;
}) {
  const [data, setData] = useState<Asset[]>([]);
  const [filteredData, setFilteredData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // 🔹 Fetch data
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
          throw new Error(`Gagal mengambil data (${res.status})`);
        }

        const json = await res.json();

        const withStatusPerolehan = json.map((item: Asset) => ({
          ...item,
          status_perolehan:
            item.status_perolehan ||
            ["Diterima", "Menunggu", "Ditolak"][
              Math.floor(Math.random() * 3)
            ],
        }));

        setData(withStatusPerolehan);
        setFilteredData(withStatusPerolehan);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // 🔍 Filter kategori + status + search
  useEffect(() => {
    let filtered = [...data];

    if (selectedKategori) {
      filtered = filtered.filter(
        (item) => item.category?.name === selectedKategori
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (item) => item.status?.name === selectedStatus
      );
    }

    if (searchValue) {
      const s = searchValue.toLowerCase();
      filtered = filtered.filter((item) =>
        [
          item.name,
          item.serial_number,
          item.lokasi,
          item.category?.name,
          item.status?.name,
          item.status_perolehan,
        ]
          .filter(Boolean)
          .some((val) => val!.toLowerCase().includes(s))
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [selectedKategori, selectedStatus, searchValue, data]);

  // 🔹 Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Fungsi bantu buat pagination ringkas
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (left > 2) range.unshift(-1); // -1 = …
    if (right < totalPages - 1) range.push(-1);

    range.unshift(1); // halaman pertama
    if (totalPages > 1) range.push(totalPages); // halaman terakhir

    return range;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-[#BBF7D0] text-[#166534]";
      case "Perbaikan":
        return "bg-yellow-200 text-yellow-800";
      case "Tidak Aktif":
      case "Non-Aktif":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusPerolehanColor = (val: string) => {
    switch (val) {
      case "Diterima":
        return "bg-green-200 text-green-800";
      case "Menunggu":
        return "bg-yellow-200 text-yellow-800";
      case "Ditolak":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) return <p className="py-5 text-center">Memuat data...</p>;
  if (error) return <p className="text-center py-5 text-red-500">{error}</p>;

  return (
    <div className="lg:rounded-b-xl lg:bg-white">
      {/* 📱 MOBILE & TABLET → CARD */}
      <div className="lg:hidden mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 flex flex-col"
            >
              {/* Header: nama + detail */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[15px] text-gray-800 truncate">
                  {item.name}
                </h3>
                <a
                  href={`/aset/${item.id}`}
                  className="text-blue-500 text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>

              {/* Serial number */}
              <p className="text-sm text-gray-500 mb-3 truncate">
                {item.serial_number || "-"}
              </p>

              {/* Info grid */}
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Kategori</span>
                  <span className="text-gray-800">
                    {item.category?.name || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Lokasi</span>
                  <span className="text-gray-800">{item.lokasi || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Status Aset</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-lg ${getStatusColor(
                      item.status?.name || ""
                    )}`}
                  >
                    {item.status?.name || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Status Perolehan</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-lg ${getStatusPerolehanColor(
                      item.status_perolehan || ""
                    )}`}
                  >
                    {item.status_perolehan}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tanggal Perolehan</span>
                  <span className="text-gray-800">
                    {item.acquisition_date || "-"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 italic">
            Tidak ada data yang cocok.
          </p>
        )}

                {/* Pagination ringkas */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-2 py-5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 text-lg ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ‹
            </button>

            {getPageNumbers().map((p, idx) =>
              p === -1 ? (
                <span key={idx} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                    currentPage === p
                      ? "bg-gray-200 text-black font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-2 text-lg ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ›
            </button>
          </div>
        )}

        {/* Info jumlah data */}
        <div className="text-sm p-2 text-gray-600 mt-3">
          Menampilkan{" "}
          <span className="font-semibold">
            {filteredData.length === 0 ? 0 : startIndex + 1}
          </span>
          –
          <span className="font-semibold">
            {Math.min(endIndex, filteredData.length)}
          </span>{" "}
          dari <span className="font-semibold">{filteredData.length}</span> data
        </div>

      </div>

      {/* 🖥️ DESKTOP → TABEL */}
      <div className="hidden lg:block overflow-x-auto mt-5 md:mt-0">
        <table className="w-full min-w-[950px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID ASET</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">KATEGORI</th>
              <th className="py-5 px-4 font-semibold">LOKASI</th>
              <th className="py-5 px-4 font-semibold">STATUS ASET</th>
              <th className="py-5 px-4 font-semibold">STATUS PEROLEHAN</th>
              <th className="py-5 px-4 font-semibold">TANGGAL PEROLEHAN</th>
              <th className="py-5 px-4 font-semibold">DETAIL</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-[#ddd] hover:bg-gray-50"
                >
                  <td className="py-5 px-4 text-[#333]">
                    {item.serial_number || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]">{item.name}</td>
                  <td className="py-5 px-4 text-[#666]">
                    {item.category?.name || "-"}
                  </td>
                  <td className="py-5 px-4 text-[#666]">{item.lokasi || "-"}</td>
                  <td className="py-5 px-4">
                    <span
                      className={`px-5 py-2 rounded-[16px] text-[13px] font-normal ${getStatusColor(
                        item.status?.name || ""
                      )}`}
                    >
                      {item.status?.name || "-"}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <span
                      className={`px-5 py-2 rounded-[16px] text-[13px] font-normal ${getStatusPerolehanColor(
                        item.status_perolehan || ""
                      )}`}
                    >
                      {item.status_perolehan}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#666]">
                    {item.acquisition_date || "-"}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <a
                      href={`/aset/${item.id}`}
                      className="text-blue-500 font-medium hover:underline"
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
                  className="py-5 text-center text-gray-500 italic"
                >
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination ringkas */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-2 py-5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 text-lg ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ‹
            </button>

            {getPageNumbers().map((p, idx) =>
              p === -1 ? (
                <span key={idx} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition ${
                    currentPage === p
                      ? "bg-gray-200 text-black font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-2 text-lg ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ›
            </button>
          </div>
        )}

        {/* Info jumlah data */}
        <div className="text-sm p-2 text-gray-600 mt-3">
          Menampilkan{" "}
          <span className="font-semibold">
            {filteredData.length === 0 ? 0 : startIndex + 1}
          </span>
          –
          <span className="font-semibold">
            {Math.min(endIndex, filteredData.length)}
          </span>{" "}
          dari <span className="font-semibold">{filteredData.length}</span> data
        </div>
      </div>
    </div>
  );
}
