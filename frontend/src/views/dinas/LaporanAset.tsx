import { useState } from "react";
import PeriodDropdown from "../../components/asset/dinas/PeriodDropdown";
import ConditionDropdown from "../../components/asset/dinas/ConditionDropdown";
import StatusDropdown from "../../components/asset/dinas/StatusDropdown";
import AssetTableSection from "../../components/asset/dinas/AssetTableSection";
import LayoutDinas from "../layout/LayoutDinas";

export default function LaporanAset() {
  // ✅ State filter dari dropdown
  const [period, setPeriod] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");

  return (
    <LayoutDinas>
      <div className="p-4 space-y-4">
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Filter Aset
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PeriodDropdown onChange={setPeriod} />
            <ConditionDropdown onChange={setCondition} />
            <StatusDropdown onChange={setStatus} />
          </div>
        </div>

        {/* ✅ Kirim nilai filter ke tabel */}
        <AssetTableSection
          period={period}
          condition={condition}
          status={status}
        />
      </div>
    </LayoutDinas>
  );
}
