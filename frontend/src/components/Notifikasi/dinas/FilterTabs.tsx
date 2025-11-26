import { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface Counts {
  semua: number;
  aset: number;
  risiko: number;
  belum: number;
}

interface FilterTabsProps {
  counts: Counts;
  onTabChange: (tabId: string) => void;
}

export default function FilterTabs({ counts, onTabChange }: FilterTabsProps) {
  const tabs: Tab[] = [
    { id: "semua", label: "Semua" },
    { id: "aset", label: "Aset" },
    { id: "risiko", label: "Risiko" },
    { id: "belum", label: "Belum Dibaca" },
  ];

  const [activeTab, setActiveTab] = useState("semua");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="flex gap-4 lg:gap-8 items-center border-b border-gray-200 pb-2">
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
          <span
            className={`text-sm ${
              activeTab === tab.id
                ? "px-2 py-[2px] rounded-full bg-[#FF2D2D] text-white font-bold"
                : "text-gray-500 font-medium"
            }`}
          >
            {counts[tab.id as keyof Counts]}
          </span>

          {tab.label}
        </button>
      ))}
    </div>
  );
}
