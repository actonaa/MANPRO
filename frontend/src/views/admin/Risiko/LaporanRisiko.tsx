import { useState } from "react";
import PeriodDropdown from "../../../components/asset/dinas/PeriodDropdown";
import LevelDropdown from "../../../components/risiko/dinas/LevelDropdown"; // ⬅️ ganti dari ConditionDropdown
import StatusDropdown from "../../../components/asset/dinas/StatusDropdown";
import RisikoTableSection from "../../../components/table/LaporanRisk";

export default function LaporanRisiko() {
  // ✅ State filter dari dropdown
  const [period, setPeriod] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");

  return (
    <>
      <div className=" space-y-6">
        {/* 🏷️ Judul dan deskripsi halaman */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Risiko</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau tingkat risiko, skor, dan status seluruh risiko aset dalam
            satu tampilan.
          </p>
        </div>

        {/* 📊 Card filter */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 📅 Periode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <PeriodDropdown onChange={setPeriod} />
            </div>

            {/* ⚠️ Level Risiko */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level Risiko
              </label>
              <LevelDropdown onChange={setLevel} />
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

        {/* 📋 Tabel risiko */}
        <RisikoTableSection period={period} level={level} status={status} />
      </div>
    </>
  );
}
