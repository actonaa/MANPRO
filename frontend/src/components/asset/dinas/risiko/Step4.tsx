/* eslint-disable @typescript-eslint/no-explicit-any */

interface Step4Props {
  formData: any;
}

export default function Step4({ formData }: Step4Props) {
  const renderArrayField = (label: string, values: string[]) => (
    <div>
      <label className="font-medium">{label}</label>
      <input
        value={(values || []).filter((v) => v.trim() !== "").join(", ")}
        disabled
        className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
      />
    </div>
  );

  const renderField = (label: string, value: string | number | undefined) => (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        disabled
        className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
      />
    </div>
  );

  return (
    <div>
      <h2 className="text-base font-semibold mb-6">
        Langkah 4 — Konfirmasi Data Risiko
      </h2>

      <div className="space-y-4">
        {renderField("Tipe", formData.tipe)}
        {renderField("Nama Risiko", formData.namaRisiko)}
        {renderField("Deskripsi Risiko", formData.deskripsiRisiko)}
        {renderArrayField("Penyebab Risiko", formData.penyebabRisiko)}
        {renderArrayField("Dampak Risiko", formData.dampakRisiko)}
        {renderField("Kategori Risiko", formData.kategoriRisiko)}
        {renderField("Area Dampak", formData.areaDampak)}
        {renderField("Probabilitas", formData.probabilitas)}
        {renderField("Dampak", formData.dampak)}
        {renderField("Kriteria Dampak", formData.kriteriaDampak)}
        {renderField("Prioritas Risiko", formData.prioritasRisiko)}
        {renderField("Level Awal", formData.levelAwal)}
        {renderField("Jenis Risiko", formData.jenisRisiko)}
        {renderField("Strategi", formData.strategi)}
        {renderField("Aksi Mitigasi", formData.aksiMitigasi)}
        {renderField("Pemilik", formData.pemilik)}
        {renderField("Target Waktu", formData.targetWaktu)}
        {renderField("Perkiraan Biaya", formData.perkiraanBiaya)}
        {renderField("Probabilitas Residual", formData.probabilitasResidual)}
        {renderField("Dampak Residual", formData.dampakResidual)}
        {renderField("Level Residual", formData.levelResidual)}
        {renderField("Efektivitas", formData.efektivitas)}
      </div>
    </div>
  );
}
