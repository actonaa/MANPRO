import { useState } from "react";
import PeriodDropdown from "../../../components/asset/dinas/PeriodDropdown";
import ConditionDropdown from "../../../components/asset/dinas/ConditionDropdown";
import StatusDropdown from "../../../components/asset/dinas/StatusDropdown";
import AssetTableSection from "../../../components/asset/dinas/AssetTableSection";

export default function LaporanAset() {
  // ✅ State filter dari dropdown
  const [period, setPeriod] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");

  return (
    <>
      <div className="p-4 space-y-6">
        {/* 🏷️ Judul dan deskripsi halaman */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Aset</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau status dan rincian seluruh aset dalam satu tampilan.
          </p>
        </div>

        {/* 📊 Card filter */}
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 📅 Periode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <PeriodDropdown onChange={setPeriod} />
            </div>

            {/* 🔧 Kondisi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kondisi
              </label>
              <ConditionDropdown onChange={setCondition} />
            </div>

            {/* 📊 Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <StatusDropdown onChange={setStatus} />
            </div>
          </div>
        </div>

        {/* 📋 Tabel aset */}
        <AssetTableSection
          period={period}
          condition={condition}
          status={status}
        />
      </div>
    </>
  );
}
