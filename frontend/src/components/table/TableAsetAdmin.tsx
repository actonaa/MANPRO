// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    XLSX: any;
  }
}

import { useEffect, useState } from "react";
import { Download, Upload, Plus } from "lucide-react";
import ExportModal from "../form/Admin/Export";
import ImportModal from "../form/Admin/Import";
import { useNavigate } from "react-router-dom";

interface Asset {
  id: string;
  name: string;
  serial_number: string;
  lokasi: string;
  acquisition_date: string;
  category?: { name: string };
  status?: { name: string };
}

export default function TableAsetAdmin() {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // ✅ Tambahan penting

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

  const handleExport = (format: string) => {
    alert(`Export data dalam format: ${format}`);
    setShowExportModal(false);
  };

  const handleImport = (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      alert("Hanya file CSV atau Excel (.xlsx) yang didukung.");
      return;
    }

    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").map((row) => row.split(","));
        const importedData = rows.slice(1).map((row, index) => ({
          id: row[0] || String(index + 1),
          name: row[1]?.replace(/"/g, "") || "-",
          serial_number: row[2] || "-",
          category: { name: row[3]?.replace(/"/g, "") || "-" },
          lokasi: row[4]?.replace(/"/g, "") || "-",
          status: { name: row[5]?.replace(/"/g, "") || "-" },
          acquisition_date: row[6]?.replace(/"/g, "") || "-",
        }));
        setData(importedData);
      };
      reader.readAsText(file);
    } else {
      // Jika Excel (.xlsx)
      reader.onload = (e) => {
        const XLSX = window.XLSX;
        if (!XLSX) {
          alert("Library XLSX belum dimuat. Pastikan koneksi internet aktif.");
          return;
        }

        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const importedData = jsonData.map((row: any, index: number) => ({
          id: row["ID"] || String(index + 1),
          name: row["Nama"] || "-",
          serial_number: row["Serial Number"] || "-",
          category: { name: row["Kategori"] || "-" },
          lokasi: row["Lokasi"] || "-",
          status: { name: row["Status"] || "-" },
          acquisition_date: row["Tanggal Perolehan"] || "-",
        }));

        setData(importedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const navigate = useNavigate();

  const HeaderSection = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 pt-5 pb-2 bg-white rounded-t-2xl border-b border-gray-200 mt-6">
      <h2 className="text-[16px] font-semibold text-gray-800">Data Aset</h2>

      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Download className="w-4 h-4" />
          Ekspor
        </button>

        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Upload className="w-4 h-4" />
          Impor
        </button>

        <button
          onClick={() => navigate("/aset-admin/tambah")}
          className="flex items-center gap-2 text-white bg-[#0095E8] hover:bg-[#007ACC] rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Aset
        </button>
      </div>
    </div>
  );

  return (
    <div className="lg:rounded-b-xl lg:bg-white mt-6 border border-gray-200 shadow-sm rounded-2xl">
      <HeaderSection />

      {loading ? (
        <div className="bg-white rounded-b-2xl border-t border-gray-200 shadow-sm">
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
                  <tr
                    key={i}
                    className="border-b border-b-[#ddd] animate-pulse"
                  >
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="py-5 px-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : error ? (
        <p className="text-center py-5 text-red-500">{error}</p>
      ) : (
        <>
          {/* MOBILE VIEW */}
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

          {/* DESKTOP VIEW */}
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
                        <span
                          className={`px-5 md:px-7 py-2 rounded-[16px] text-base font-normal ${getStatusColor(
                            item.status?.name || ""
                          )}`}
                        >
                          {item.status?.name || "-"}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-[#666] lg:text-[17px]">
                        {item.acquisition_date || "-"}
                      </td>
                      <td className="py-5 px-4">
                        <a
                          href={`/aset/${item.id}`}
                          className="text-[#0095E8] font-medium lg:text-[17px] cursor-pointer hover:underline"
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
        </>
      )}

      {/* MODALS */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
}
