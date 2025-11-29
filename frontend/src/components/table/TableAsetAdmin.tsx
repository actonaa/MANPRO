import { useNavigate } from "react-router-dom";
import { Upload, Download } from "lucide-react";
import ButtonImg from "../../components/button/ButtonImg";

import ExportModal from "../../components/form/Admin/Export";
import ImportModal from "../../components/form/Admin/Import";
import { useState } from "react";

export interface AsetItem {
  id: string;
  kode_aset: string;
  nama_aset: string;
  kategori: string;
  lokasi: string;
  status_aset: string;
  status_pengajuan: string;
  tanggal_perolehan: string;
  dinas: string;
}

export default function TableAsetAdmin({
  data,
  loading,
}: {
  data: AsetItem[];
  loading: boolean;
}) {
  const navigate = useNavigate();

  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalData = data.length;
  const totalPages = Math.ceil(totalData / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalData);

  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate minimal pagination numbers
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Memuat data aset...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      {/* HEADER */}
      <div className="flex justify-between border-b border-gray-300 py-4 items-center mb-4">
        <h2 className="text-lg font-semibold">Data Aset</h2>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50"
            onClick={() => setOpenExport(true)}
          >
            <Upload size={16} /> Ekspor
          </button>

          <button
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50"
            onClick={() => setOpenImport(true)}
          >
            <Download size={16} /> Impor
          </button>

          <ButtonImg
            title="Tambah Aset"
            img="/kelola-asset/tambah-asset.png"
            color="#00a9ff"
            hoverColor="#a0e9ff"
            borderColor="#00a9ff"
            textColor="white"
            px="6"
            fontWeight="font-medium"
            onClick={() => navigate("/aset-admin/tambah")}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-sm text-center">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-7">ID ASET</th>
              <th>Nama Aset</th>
              <th className="pr-2">Kategori</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>
                Status <br /> Pengajuan
              </th>
              <th>
                Tanggal <br /> Perolehan
              </th>
              <th>Dinas</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="py-4">{item.id}</td>
                <td>{item.nama_aset}</td>
                <td>{item.kategori}</td>
                <td>{item.lokasi}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status_aset === "Aktif"
                        ? "bg-green-100 text-green-700"
                        : item.status_aset === "Perbaikan"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status_aset}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status_pengajuan === "Diterima"
                        ? "bg-green-100 text-green-700"
                        : item.status_pengajuan === "Menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status_pengajuan}
                  </span>
                </td>

                <td>{item.tanggal_perolehan}</td>
                <td>{item.dinas}</td>

                <td>
                  <button
                    onClick={() => navigate(`/aset-admin/${item.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        {/* Menampilkan data */}
        <p className="text-sm text-gray-600">
          Menampilkan <strong>{startIndex + 1}</strong>–
          <strong>{endIndex}</strong> dari <strong>{totalData}</strong> hasil
        </p>

        {/* Pagination di tengah */}
        <div className="flex items-center gap-2 mx-auto">
          {/* Prev */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{"<"}</span>
          </button>

          {/* Nomor halaman + ellipsis */}
          {generatePageNumbers().map((p, i) => (
            <button
              key={i}
              onClick={() => typeof p === "number" && handlePageChange(p)}
              className={`px-3 py-1 rounded-lg text-sm
          ${
            p === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "hover:bg-gray-100"
          }
          ${p === "..." ? "cursor-default border-none text-gray-500" : ""}
        `}
              disabled={p === "..."}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1  rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{">"}</span>
          </button>
        </div>
      </div>

      {/* MODAL */}
      <ExportModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        onExport={(format) => console.log(format)}
      />

      <ImportModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        onImport={(file) => console.log(file)}
      />
    </div>
  );
}
