import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface FilterTabsProps {
  onTabChange: (tabId: string) => void;
}

export default function FilterTabs({ onTabChange }: FilterTabsProps) {
  const tabs: Tab[] = [
    { id: "semua", label: "Semua", count: 20 },
    { id: "aset", label: "Aset", count: 10 },
    { id: "risiko", label: "Risiko", count: 17 },
    { id: "belum", label: "Belum Dibaca", count: 5 },
  ];

  const [activeTab, setActiveTab] = useState("semua");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="flex gap-8 items-center border-b border-gray-200 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex items-center gap-2 text-sm sm:text-base transition duration-200 ${
            activeTab === tab.id
              ? "font-semibold text-black border-b-2 border-black pb-2"
              : "text-gray-500 hover:text-blue-600 pb-2"
          }`}
        >
          {/* 📊 Angka notif: tetap muncul */}
          <span
            className={`text-sm ${
              activeTab === tab.id
                ? "px-2 py-[2px] rounded-full bg-[#FF2D2D] text-white font-bold"
                : "text-gray-500 font-medium"
            }`}
          >
            {tab.count}
          </span>

          {/* 📁 Label tab */}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
