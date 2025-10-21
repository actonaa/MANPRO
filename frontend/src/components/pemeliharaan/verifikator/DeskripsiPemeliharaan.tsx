import React from "react";

interface DeskripsiPemeliharaanProps {
  deskripsi: string;
}

const DeskripsiPemeliharaan: React.FC<DeskripsiPemeliharaanProps> = ({
  deskripsi,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <p className="text-sm text-gray-500 mb-2">Deskripsi</p>
      <p className="text-base text-gray-800">{deskripsi}</p>
    </div>
  );
};

export default DeskripsiPemeliharaan;
