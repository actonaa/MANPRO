import React from "react";

// Definisikan tipe props-nya
interface InfoPemeliharaanProps {
  tipePemeliharaan: string;
  biaya: string;
  vendor: string;
}

const InfoPemeliharaan: React.FC<InfoPemeliharaanProps> = ({
  tipePemeliharaan,
  biaya,
  vendor,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="mb-3">
        <p className="text-sm text-gray-500">Tipe Pemeliharaan</p>
        <p className="text-lg font-semibold">{tipePemeliharaan}</p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Biaya</p>
        <p className="text-lg font-semibold text-gray-800">{biaya}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Vendor</p>
        <p className="text-lg font-semibold text-gray-800">{vendor}</p>
      </div>
    </div>
  );
};

export default InfoPemeliharaan;
