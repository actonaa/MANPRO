import FilterDate from "../../../components/filter/FilterDate";
import ButtonFilter from "../../../components/button/ButtonFilter";
import CardList from "../../../components/card/CardList";
import TableAsetAdmin from "../../../components/table/TableAsetAdmin";
import type { AsetItem } from "../../../components/table/TableAsetAdmin";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function AsetAdmin() {
  const [search, setSearch] = useState("");

  const [dataAset, setDataAset] = useState<AsetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAset = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://asset-risk-management.vercel.app/api/assets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      // ✔ FIX: mapping lokasi -> item.lokasi
      const formatted = json.map((item: any) => ({
        id: item.id,
        kode_aset: item.serial_number,
        nama_aset: item.name,
        kategori: item.category?.name || "-",
        lokasi: item.lokasi || "-", // ✔ FIX DI SINI
        status_aset: item.status?.name || "Aktif",
        status_pengajuan:
          item.approval_status === "approved"
            ? "Diterima"
            : item.approval_status === "pending"
            ? "Menunggu"
            : "Ditolak",
        tanggal_perolehan: item.acquisition_date || "-",
        dinas: item.department?.name || "-",
      }));

      setDataAset(formatted);
    } catch (err) {
      console.error("Error fetch aset:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAset();
  }, []);

  return (
    <>
      <h1 className="font-semibold text-[22px] mb-4 md:text-2xl lg:text-[28px]">
        Kelola Aset
      </h1>

      {/* SUMMARY */}
      <div className="mb-5 overflow-x-auto pb-4 md:pb-6">
        <div className="flex gap-4 min-w-[800px] sm:grid sm:grid-cols-2 lg:grid-cols-4">
          <CardList title="Total Aset" value="200" />
          <CardList title="Aset Perlu Perbaikan" value="560" />
          <CardList title="Aset Akan Dihapus" value="200" />
          <CardList title="Risiko Aktif" value="499" />
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 w-[400px] mb-5">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari nama aset / kode aset..."
            className="w-full bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dinas</p>
            <ButtonFilter
              label="Dinas"
              options={["Dinas Pariwisata", "Dinas Pendidikan", "Dinas Komunikasi"]}
              onSelect={(v) => console.log(v)}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Periode</p>
            <FilterDate />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Kategori</p>
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Aset Non TI"]}
              onSelect={(v) => console.log(v)}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <ButtonFilter
              label="Status"
              options={["Aktif", "Perbaikan", "Tidak Aktif"]}
              onSelect={(v) => console.log(v)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <TableAsetAdmin data={dataAset} loading={loading} />
    </>
  );
}
