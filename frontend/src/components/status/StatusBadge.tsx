import React from "react";

interface StatusBadgeProps {
  status: "Aktif" | "Perbaikan" | "Akan Dihapus" | "Tidak Aktif";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "Aktif":
        return "bg-green-200 text-green-800";
      case "Akan Dihapus":
      case "Perbaikan":
        return "bg-yellow-200 text-yellow-800";
      case "Tidak Aktif":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getBadgeStyle()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
