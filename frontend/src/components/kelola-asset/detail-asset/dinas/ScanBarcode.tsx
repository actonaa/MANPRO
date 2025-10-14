import React from "react";

interface ScanBarcodeProps {
  barcodeUrl: string;
}

const ScanBarcode: React.FC<ScanBarcodeProps> = ({ barcodeUrl }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <img src={barcodeUrl} alt="QR Code" className="w-24 h-24" />
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Scan Barcode/RFID</h2>
        <p className="text-gray-700 text-sm">
          Pindai tag untuk update status, lokasi, atau audit cepat.
        </p>
      </div>
    </div>
  );
};

export default ScanBarcode;
