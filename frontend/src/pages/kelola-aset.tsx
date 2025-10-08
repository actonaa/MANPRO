import Layout from "../components/contanct/Layout";
import TambahAssetButton from "../components/button/TambahAsset";

export default function Aset() {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Kelola Aset</h1>
          <TambahAssetButton />
        </div>

        {/* Konten tabel aset bisa kamu tambahkan di sini */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <p>Daftar aset akan muncul di sini...</p>
        </div>
      </div>
    </Layout>
  );
}
