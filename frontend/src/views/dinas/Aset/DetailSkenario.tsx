/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonImg from "../../../components/button/ButtonImg";
import { useNavigate } from "react-router-dom";

export default function SkenarioDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_LINK_API_SIRASA;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token tidak ditemukan. Silakan login ulang.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/scenarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();
        console.log("HASIL API:", result);

        // Backend mengirim langsung object, bukan result.data
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [API_URL, id]);

  if (loading) return <p>Mengambil data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Tidak ada data ditemukan.</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">{data.name}</h1>

      <div className="grid grid-cols-2 gap-5">
        {/* DETAIL SKENARIO */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Detail Skenario</h2>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nama:</span> {data.name}
            </p>

            <p>
              <span className="font-semibold">Deskripsi:</span>{" "}
              {data.description}
            </p>

            <p>
              <span className="font-semibold">Posisi Jabatan:</span>{" "}
              {data.owner_position?.name}
            </p>

            <p>
              <span className="font-semibold">ID Pemilik Jabatan:</span>{" "}
              {data.owner_position_id}
            </p>

            <div>
              <span className="font-semibold">Aset Terkait:</span>
              <ul className="list-disc ml-6 mt-1">
                {data.assets?.map((asset: any) => (
                  <li key={asset.id}>{asset.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RISIKO TERKAIT */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Risiko Terkait</h2>

          <ButtonImg
            title="Tambah Risiko"
            img="/kelola-asset/tambah-asset.png"
            color="#007BFF"
            hoverColor="#A5D4FF"
            borderColor="#007BFF"
            textColor="white"
            px="2"
            fontWeight="font-medium"
            wFull="w-full"
            paddingY="py-3"
            onClick={() => navigate(`/risiko/tambahs/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
