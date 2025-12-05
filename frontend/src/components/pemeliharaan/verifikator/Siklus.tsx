import React from "react";

interface SiklusHidupCardProps {
  siklusHidup?: any[];
}

const SiklusHidupCard: React.FC<SiklusHidupCardProps> = ({ siklusHidup }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg mb-4">Siklus Hidup</h2>
      {siklusHidup && siklusHidup.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {siklusHidup.map((item, idx) => (
            <li key={idx} className="border border-gray-200 rounded-xl px-4 py-2">
              {item.name || `Tahap ${idx + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Tidak ada data siklus hidup</p>
      )}
    </div>
  );
};

export default SiklusHidupCard;
