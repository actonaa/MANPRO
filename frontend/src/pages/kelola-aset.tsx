import { useEffect, useState } from "react";
import Layout from "../components/contanct/Layout";
import TambahAssetButton from "../components/kelola-asset/TambahAsset";
import ExportButton from "../components/kelola-asset/Export";
import Filterbar from "../components/kelola-asset/Filterbar";

export default function Aset() {
  const [dataAset, setDataAset] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // fungsi ambil data dari API
  const fetchDataAset = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/aset");
      const result = await response.json();
      setDataAset(result);
    } catch (error) {
      console.error("Gagal mengambil data aset:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAset();
  }, []);

  // Fungsi untuk memberi warna status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-700";
      case "Perbaikan":
        return "bg-yellow-100 text-yellow-700";
      case "Tidak aktif":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Hitung data untuk halaman saat ini
  const totalPages = Math.ceil(dataAset.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = dataAset.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Kelola Aset</h1>
          <TambahAssetButton />
        </div>

        {/* Filter dan Export */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <Filterbar />
          <ExportButton />
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-4 text-gray-500">Memuat data aset...</p>
          ) : (
            <>
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ID Aset</th>
                    <th className="px-4 py-3 font-semibold">Nama Aset</th>
                    <th className="px-4 py-3 font-semibold">Kategori</th>
                    <th className="px-4 py-3 font-semibold">Lokasi</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">
                      Tanggal Perolehan
                    </th>
                    <th className="px-4 py-3 font-semibold">Akses</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{item.id}</td>
                        <td className="px-4 py-3">{item.nama}</td>
                        <td className="px-4 py-3">{item.kategori}</td>
                        <td className="px-4 py-3">{item.lokasi}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.tanggalPerolehan}</td>
                        <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline">
                          Lihat
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-gray-500 italic"
                      >
                        Tidak ada data aset yang tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Footer Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 p-4 gap-4">
                {/* Kiri: Info data */}
                <span className="text-center sm:text-left w-full sm:w-auto">
                  Menampilkan {startIndex + 1}–
                  {Math.min(startIndex + itemsPerPage, dataAset.length)} dari{" "}
                  {dataAset.length} data aset
                </span>

                {/* Tengah: Nomor Halaman */}
                <div className="flex justify-center w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border font-semibold transition
            ${
              currentPage === i + 1
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 text-gray-700 hover:bg-blue-100"
            }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kanan: Navigasi */}
                <div className="flex justify-end w-full sm:w-auto gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`border border-gray-300 rounded-lg px-3 py-1 transition ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`border border-gray-300 rounded-lg px-3 py-1 transition ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
