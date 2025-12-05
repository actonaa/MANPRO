import React from "react";

interface LampiranCardProps {
  lampiran?: any[];
}

const LampiranCard: React.FC<LampiranCardProps> = ({ lampiran }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg mb-4">Lampiran</h2>
      {lampiran && lampiran.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {lampiran.map((item, idx) => (
            <li key={idx} className="border border-gray-200 rounded-xl px-4 py-2">
              {item.name || `Lampiran ${idx + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Tidak ada lampiran</p>
      )}
    </div>
  );
};

export default LampiranCard;
