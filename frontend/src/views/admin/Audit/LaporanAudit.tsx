import { useState } from "react";
import TabelLaporanAuditAdmin from "../../../components/table/TabelLaporanAuditAdmin";
import DinasDropdown from "../../../components/asset/Admin/DinasDropdown";
import PeriodDropdown from "../../../components/asset/dinas/PeriodDropdown";
import ConditionDropdown from "../../../components/asset/dinas/ConditionDropdown";
import StatusAuditDropdown from "../../../components/asset/Admin/StatusAudit"; // ✅ penamaan benar & konsisten

const data = [
  {
    id: 1,
    datetime: "10/24/2025 - 10:45",
    user: "Rajendra Wahyu",
    dinas: "Dinas Kesehatan",
    role: "Verifikator",
    module: "Aset",
    action: "UPDATE",
  },
  {
    id: 2,
    datetime: "10/24/2025 - 10:45",
    user: "Khoirul Ansori",
    dinas: "Dinas Pendidikan",
    role: "User Dinas",
    module: "Risiko",
    action: "CREATE",
  },
  {
    id: 3,
    datetime: "10/24/2025 - 10:45",
    user: "Vio Actona",
    dinas: "Diskominfo",
    role: "Administrator",
    module: "Users",
    action: "UPDATE",
  },
  {
    id: 4,
    datetime: "10/24/2025 - 10:45",
    user: "Fahmi Akhyar",
    dinas: "Dinas Perhubungan",
    role: "Verifikator",
    module: "Aset",
    action: "DELETE",
  },
  {
    id: 5,
    datetime: "10/24/2025 - 10:45",
    user: "Vio Actona",
    dinas: "Diskominfo",
    role: "Administrator",
    module: "Users",
    action: "UPDATE",
  },
];

export default function LaporanAudit() {
  // ✅ State filter
  const [dinas, setDinas] = useState("");
  const [period, setPeriod] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* 🏷️ Judul Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Laporan Audit</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau semua aktivitas pengguna dan sistem.
        </p>
      </div>

      {/* 📊 Filter */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 🏢 Dinas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dinas
            </label>
            <DinasDropdown onChange={setDinas} />
          </div>

          {/* 📅 Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <PeriodDropdown onChange={setPeriod} />
          </div>

          {/* 🔧 Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <ConditionDropdown onChange={setCondition} />
          </div>

          {/* 📊 Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <StatusAuditDropdown onChange={setStatus} />
          </div>
        </div>
      </div>

      {/* 🧾 Tabel Laporan Audit */}
      <TabelLaporanAuditAdmin
        data={data}
        dinas={dinas}
        periode={period}
        kategori={condition}
        status={status}
      />
    </div>
  );
}
