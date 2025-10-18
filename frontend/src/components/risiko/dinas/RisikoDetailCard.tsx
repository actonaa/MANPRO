export default function RisikoDetailCard() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 font-bold">ID RISIKO</p>
          <p className="font-bold text-gray-800">RISK-102-2025</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">NAMA ASET</p>
          <p className="font-bold text-gray-800">Server</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Pemilik Risiko</p>
          <p className="font-bold text-gray-800">IT Staff</p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Deskripsi</p>
          <p className="font-bold text-gray-700">
            Risiko ini dapat menyebabkan kebocoran data, gangguan operasional,
            kehilangan kepercayaan publik, serta kerugian finansial.
          </p>
        </div>

        {/* 📁 Kolom kanan */}
        <div>
          <p className="text-sm text-gray-500 font-bold">Dampak</p>
          <p className="font-bold text-gray-800">
            Kebocoran data, Gangguan Layanan.
          </p>

          <p className="mt-4 text-sm text-gray-500 font-bold">Penyebab</p>
          <p className="font-bold text-gray-800">
            Kelemahan keamanan sistem, Kelalaian Pengguna.
          </p>

          <p className="mt-4 text-sm text-gray-500 font-bold">
            Kriteria Dampak
          </p>
          <p className="font-bold text-gray-800">
            Keterlambatan layanan &lt; 1 jam tanpa kerugian finansial.
          </p>

          {/* 📊 Bagian Nilai dalam 3 kolom sejajar rata kiri */}
          <div className="mt-6 grid grid-cols-3">
            <div>
              <p className="text-sm text-gray-500 font-bold">
                Nilai Probabilitas
              </p>
              <p className="text-xl font-bold text-red-600">5</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold">Nilai Dampak</p>
              <p className="text-xl font-bold text-red-600">5</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold">
                Nilai Risiko Dasar
              </p>
              <p className="text-xl font-bold text-red-600">25 - TINGGI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
