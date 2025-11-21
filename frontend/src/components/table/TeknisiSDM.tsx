/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload, Plus } from "lucide-react";
import ImportModal from "../form/Admin/Import";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../filter/Search";
import axios from "axios";

interface SDM {
  nip: string;
  nama: string;
  jabatan: string;
  dinas: string;
  periodeKerja: string;
  hr_id: string;
}

interface Props {
  search: string;
  filterDinas: string;
  filterPeriode: { start: string; end: string } | null;
}

export default function TabelSDM({
  search,
  filterDinas,
  filterPeriode,
}: Props) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [data, setData] = useState<SDM[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch API dengan token (aman jika response beda shape)
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<any>(
          "https://sso-user-management.vercel.app/api/hr",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const list = res.data?.data ?? [];

        const mapped = Array.isArray(list)
          ? list.map((item: any) => ({
              hr_id: item.hr_id,
              nip: item.nip ?? "-",
              nama: item.name ?? "-",
              jabatan:
                item.position && item.position !== "-" ? item.position : "-",
              dinas: item.department ?? "-",
              periodeKerja: item.periodeKerja ?? "-", // fallback, kalau ada nanti pakai itu
            }))
          : [];

        setData(mapped);
      } catch (err) {
        console.error("Error fetch SDM:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [token]); // tambahin token sebagai dependency bila berubah

  // Parse date helpers (aman terhadap input invalid)
  const parseDDMMYYYY = (str: string) => {
    if (!str || typeof str !== "string") return new Date(""); // invalid date
    const parts = str.split("/");
    if (parts.length !== 3) return new Date("");
    const [d, m, y] = parts;
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  };

  const parseYYYYMMDD = (str: string) => {
    if (!str || typeof str !== "string") return new Date("");
    const parts = str.split("-");
    if (parts.length !== 3) return new Date("");
    const [y, m, d] = parts;
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  };

  // FINAL FILTER
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1) search (aman walau search kosong)
      const q = (search || "").toLowerCase();
      const matchSearch =
        (item.nama || "").toLowerCase().includes(q) ||
        (item.nip || "").toLowerCase().includes(q) ||
        (item.jabatan || "").toLowerCase().includes(q);

      // 2) filter dinas
      const matchDinas = filterDinas
        ? (item.dinas || "").toLowerCase() === filterDinas.toLowerCase()
        : true;

      // 3) filter periode
      let matchPeriode = true;

      if (filterPeriode && filterPeriode.start && filterPeriode.end) {
        // jika item.periodeKerja valid dan berbentuk "DD/MM/YYYY - DD/MM/YYYY"
        if (item.periodeKerja && typeof item.periodeKerja === "string") {
          const parts = item.periodeKerja.split(" - ");
          if (parts.length > 0 && parts[0]) {
            const periodStartStr = parts[0].trim();
            const itemDate = parseDDMMYYYY(periodStartStr);
            const start = parseYYYYMMDD(filterPeriode.start);
            const end = parseYYYYMMDD(filterPeriode.end);

            // jika salah satu menjadi invalid date, anggap matchPeriode = true (tidak filter)
            if (
              !isNaN(itemDate.getTime()) &&
              !isNaN(start.getTime()) &&
              !isNaN(end.getTime())
            ) {
              matchPeriode = itemDate >= start && itemDate <= end;
            } else {
              matchPeriode = true;
            }
          } else {
            matchPeriode = true;
          }
        } else {
          matchPeriode = true;
        }
      }

      return matchSearch && matchDinas && matchPeriode;
    });
  }, [search, filterDinas, filterPeriode, data]);

  return (
    <div className="lg:rounded-b-xl lg:bg-white mt-6 border border-gray-200 shadow-sm rounded-2xl">
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[18px] md:mb-0 md:p-4">
        Data Sumber Daya Manusia
      </h1>

      {/* header */}
      <div className="flex justify-between items-center gap-2 p-4 bg-white border-b border-gray-200 rounded-t-2xl">
        {/* jangan kirim prop `disabled` kecuali SearchBar mendukungnya; kirim value saja */}
        <SearchBar placeholder="Cari SDM..." onChange={() => {}} />

        <div className="flex gap-5">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 text-[#444] border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-[14px] font-medium"
          >
            <Upload className="w-4 h-4" />
            Impor
          </button>

          <Link
            to="/sdm-admin-tambah"
            className="flex items-center gap-2 text-white bg-[#0095E8] hover:bg-[#007ACC] rounded-lg px-4 py-2 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4" />
            Tambah SDM
          </Link>
        </div>
      </div>

      {/* skeleton */}
      {loading && (
        <div className="p-6 text-center text-gray-500">Memuat data SDM...</div>
      )}

      {/* MOBILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:hidden space-y-4 mt-5 md:mt-0">
        {!loading &&
          filteredData.map((item) => (
            <div
              key={item.hr_id}
              className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <p className="text-[15px] text-gray-600 font-medium">
                  {item.nip}
                </p>

                <Link
                  to={`/sdm-admin/${item.hr_id}`}
                  className="text-[#0095E8] font-medium text-[15px] hover:underline"
                >
                  Detail
                </Link>
              </div>

              <h2 className="text-[16px] font-semibold text-gray-900 mt-1">
                {item.nama}
              </h2>

              <hr className="my-3 border-gray-200" />

              <div className="space-y-1 text-[15px] text-gray-700">
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Jabatan</span>
                  <span>{item.jabatan}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Dinas</span>
                  <span>{item.dinas}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Periode</span>
                  <span>{item.periodeKerja}</span>
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* DESKTOP TABLE */}
      {!loading && (
        <div className="hidden lg:block overflow-x-auto bg-white rounded-b-xl">
          <table className="w-full text-[14px] border-collapse text-center">
            <thead className="text-[#555]">
              <tr>
                <th className="py-5 px-4 font-semibold">NIP</th>
                <th className="py-5 px-4 font-semibold">NAMA</th>
                <th className="py-5 px-4 font-semibold">JABATAN</th>
                <th className="py-5 px-4 font-semibold">DINAS</th>
                <th className="py-5 px-4 font-semibold">PERIODE KERJA</th>
                <th className="py-5 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.hr_id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-5 px-4 font-semibold text-[#444]">
                    {item.nip}
                  </td>
                  <td className="py-5 px-4 text-[#444]">{item.nama}</td>
                  <td className="py-5 px-4 text-[#444]">{item.jabatan}</td>
                  <td className="py-5 px-4 text-[#444]">{item.dinas}</td>
                  <td className="py-5 px-4 text-[#444]">{item.periodeKerja}</td>
                  <td className="py-5 px-4">
                    <Link
                      to={`/sdm-admin/${item.hr_id}`}
                      className="text-[#0095E8] text-[14px] hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4">
            <p className="text-[14px] text-gray-600">
              Menampilkan {filteredData.length} hasil
            </p>
          </div>
        </div>
      )}

      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={(file) => console.log("Import SDM:", file)}
        />
      )}
    </div>
  );
}
