/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    XLSX: any;
  }
}

import { useEffect, useState } from "react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  owner_position?: { name: string };
  assets: { id: string; name: string }[];
}

export default function TableSkenario({
  searchValue,
}: {
  selectedKategori?: string;
  selectedStatus?: string;
  searchValue?: string;
}) {
  const [data, setData] = useState<Scenario[]>([]);
  const [filteredData, setFilteredData] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // 🔹 Fetch data skenario
  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://asset-risk-management.vercel.app/api/scenarios",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);

        const json = await res.json();

        setData(json);
        setFilteredData(json);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // 🔍 Filtering berdasarkan search
  useEffect(() => {
    let filtered = [...data];

    if (searchValue) {
      const s = searchValue.toLowerCase();
      filtered = filtered.filter((item) =>
        [
          item.name,
          item.description,
          item.owner_position?.name,
          item.assets.map((a) => a.name).join(", "),
        ]
          .filter(Boolean)
          .some((val) => val!.toLowerCase().includes(s))
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchValue, data]);

  // 🔹 Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 1) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= maxVisible) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
      pages.push(-1, totalPages);
    } else if (currentPage >= totalPages - maxVisible + 1) {
      pages.push(1, -1);
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      pages.push(
        1,
        -1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        -1,
        totalPages
      );
    }

    return pages;
  };

  // ===========================
  //   LOADING SKELETON
  // ===========================
  if (loading) {
    return (
      <div className="animate-pulse">
        {/* mobile skeleton */}
        <div className="lg:hidden mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3"
            >
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* desktop skeleton */}
        <div className="hidden lg:block bg-white rounded-b-xl">
          <table className="w-full min-w-[950px] text-[13px] border-collapse">
            <thead>
              <tr className="bg-white">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="py-5 px-4">
                      <div className="h-3 bg-gray-300 rounded w-20 mx-auto"></div>
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="border-b border-gray-200 bg-white">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <td key={i} className="py-5 px-4">
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center py-5 text-red-500">{error}</p>;

  // ===========================
  //   UI FINAL
  // ===========================
  return (
    <div className="lg:rounded-b-xl lg:bg-white">
      {/* MOBILE CARD */}
      <div className="lg:hidden mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[15px] text-gray-800 truncate">
                  {item.name}
                </h3>
                <a
                  href={`/skenario/${item.id}`}
                  className="text-blue-500 text-sm font-medium hover:underline"
                >
                  Detail
                </a>
              </div>

              <p className="text-sm text-gray-500 mb-2 truncate">
                {item.description || "-"}
              </p>

              <div className="text-sm text-gray-700">
                <strong>Assets:</strong>{" "}
                {item.assets.map((a) => a.name).join(", ")}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 italic">
            Tidak ada data yang cocok.
          </p>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto mt-5 md:mt-0">
        <table className="w-full min-w-[950px] text-[13px] text-center border-collapse">
          <thead className="text-[#666]">
            <tr>
              <th className="py-5 px-4 font-semibold">ID SKENARIO</th>
              <th className="py-5 px-4 font-semibold">NAMA SKENARIO</th>
              <th className="py-5 px-4 font-semibold">DESKRIPSI</th>
              <th className="py-5 px-4 font-semibold">NAMA ASET</th>
              <th className="py-5 px-4 font-semibold">PIC</th>
              <th className="py-5 px-4 font-semibold">DETAIL</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-gray-200 hover:bg-gray-50"
                >
                  <td className="py-5 px-4">{item.id}</td>
                  <td className="py-5 px-4">{item.name}</td>
                  <td className="py-5 px-4">{item.description || "-"}</td>
                  <td className="py-5 px-4">
                    {item.assets.map((a) => a.name).join(", ")}
                  </td>
                  <td className="py-5 px-4">
                    {item.owner_position?.name || "-"}
                  </td>
                  <td className="py-5 px-4">
                    <a
                      href={`/skenario/${item.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-5 text-center text-gray-500 italic"
                >
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Desktop */}
        <div className="grid grid-cols-3 items-center px-5">
          <div className="text-sm py-5 text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">
              {filteredData.length === 0 ? 0 : startIndex + 1}
            </span>
            –
            <span className="font-semibold">
              {Math.min(endIndex, filteredData.length)}
            </span>{" "}
            dari <span className="font-semibold">{filteredData.length}</span>{" "}
            data
          </div>

          <div className="flex justify-center">
            {filteredData.length > ITEMS_PER_PAGE && (
              <div className="flex items-center gap-2 py-5">
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
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
}
