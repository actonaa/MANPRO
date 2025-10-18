import React from "react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]; // ✅ pakai any supaya fleksibel
}

const getColor = (kategori: string) => {
  switch (kategori) {
    case "tinggi":
      return "#FF2D2D"; // merah
    case "menengah":
      return "#FFE74D"; // kuning
    case "sedang":
      return "#FF9D00"; // oranye
    case "sedang-rendah":
      return "#FFBB4D"; // oranye terang
    case "rendah":
      return "#58DA28"; // hijau
    default:
      return "#D1D5DB";
  }
};

const Top10Risiko: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto lg:max-w-none lg:mt-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        📊 Tingkat Risiko
      </h2>

      <div className="space-y-5">
        {data.map((risiko, index) => (
          <div key={index}>
            {/* Label risiko */}
            <p className="text-sm font-medium text-gray-700 mb-2">
              Risiko {risiko.id}: {risiko.nama}
            </p>

            {/* Progress bar */}
            <div className="w-full h-4 bg-[#D1D5DB] rounded-full overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-700"
                style={{
                  width: `${risiko.nilai}%`,
                  backgroundColor: getColor(risiko.kategori),
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top10Risiko;
