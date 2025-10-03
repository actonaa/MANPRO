import React from "react";

type CardProps = {
  title: string;
  value: string | number;
  icon?: string; // opsional
  color?: string;
};

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="flex-1 bg-white pb-10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-lg mb-2">{title}</p>
          <h2 className="text-4xl font-bold text-gray-900">{value}</h2>
        </div>
        {icon && (
          <div className={`${color} p-2 rounded-lg`}>
            <img src={icon} alt="icon" className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
