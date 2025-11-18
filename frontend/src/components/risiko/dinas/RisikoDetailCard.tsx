type RisikoDetailCardProps = {
  idRisiko?: string;
  assetName?: string;
  owner?: string;
  description?: string;
  impact?: string;
  cause?: string;
  impactCriteria?: string;
  nilaiProbabilitas?: number;
  nilaiDampak?: number;
  nilaiRisiko?: number;
  levelRisiko?: string;
  areaDampak?: string;
  kategoriRisiko?: string;
  jenis?: string;
  tipeAset?: string;
};

export default function RisikoDetailCard({
  idRisiko = "-",
  assetName = "-",
  owner = "-",
  description = "-",
  impact = "-",
  cause = "-",
  impactCriteria = "-",
  nilaiProbabilitas = 0,
  nilaiDampak = 0,
  nilaiRisiko = 0,
  levelRisiko = "-",
  areaDampak = "-",
  kategoriRisiko = "-",
  jenis = "-",
  tipeAset = "-",
}: RisikoDetailCardProps) {
  // 🎨 Warna nilai sesuai level risiko
  const getRiskColor = (level: string) => {
    if (["Sangat Rendah", "Rendah", "Low"].includes(level))
      return "text-[#58DA28]";
    if (["Sedang", "Medium"].includes(level)) return "text-[#FFBB4D]";
    if (["Tinggi", "Sangat Tinggi", "High"].includes(level))
      return "text-[#FF2D2D]";
    return "text-gray-800";
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 📄 Kolom kiri */}
        <div>
          <p className="text-sm text-gray-500 font-bold">ID RISIKO</p>
          <p className="font-bold text-gray-800">{idRisiko}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">NAMA ASET</p>
          <p className="font-bold text-gray-800">{assetName}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">TIPE ASET</p>
          <p className="font-bold text-gray-800">{tipeAset}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Pemilik Risiko</p>
          <p className="font-bold text-gray-800">{owner}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Jenis Risiko</p>
          <p className="font-bold text-gray-800">{jenis}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Deskripsi</p>
          <p className="font-bold text-gray-700">{description}</p>
        </div>

        {/* 📁 Kolom kanan */}
        <div>
          <p className="text-sm text-gray-500 font-bold">Kategori Risiko</p>
          <p className="font-bold text-gray-800">{kategoriRisiko}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Dampak</p>
          <p className="font-bold text-gray-800">{impact}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Area Dampak</p>
          <p className="font-bold text-gray-800">{areaDampak}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Penyebab</p>
          <p className="font-bold text-gray-800">{cause}</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">
            Kriteria Dampak
          </p>
          <p className="font-bold text-gray-800">{impactCriteria}</p>

          {/* 📊 Nilai-nilai risiko */}
          <div className="mt-6 grid grid-cols-3">
            <div>
              <p className="text-sm text-gray-500 font-bold">
                Nilai Probabilitas
              </p>
              <p className="text-xl font-bold text-gray-800">
                {nilaiProbabilitas}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold">Nilai Dampak</p>
              <p className="text-xl font-bold text-gray-800">{nilaiDampak}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold">
                Nilai Risiko Dasar
              </p>
              <p className={`text-xl font-bold ${getRiskColor(levelRisiko)}`}>
                {nilaiRisiko} - {levelRisiko.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
