/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function TambahMitigasi() {
  const { riskId } = useParams();
  const navigate = useNavigate();

  const [probabilitas, setProbabilitas] = useState("");
  const [dampak, setDampak] = useState("");
  const [strategi, setStrategi] = useState("");
  const [biaya, setBiaya] = useState("");
  const [targetWaktu, setTargetWaktu] = useState("");
  const [efektivitas, setEfektivitas] = useState("");
  const [levelResidual, setLevelResidual] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [aksiMitigasi, setAksiMitigasi] = useState("");

  const [typeOfRisk, setTypeOfRisk] = useState<"positif" | "negatif" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Ambil detail risiko untuk jenis risiko (positif/negatif)
  useEffect(() => {
    const fetchRiskType = async () => {
      if (!riskId) return;

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://asset-risk-management.vercel.app/api/risks/${riskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        // Karena struktur responsenya langsung object risiko
        const type = data?.type_of_risk; // ⬅️ FIX

        if (type) {
          setTypeOfRisk(type.toLowerCase());
        } else {
          console.log("type_of_risk tidak ditemukan:", data);
        }
      } catch (err) {
        console.error("Gagal mengambil data risiko", err);
      }
    };

    fetchRiskType();
  }, [riskId]);

  // 🔥 Daftar strategi sesuai jenis risiko
  const strategiNegatif = [
    "Eskalasi Risiko",
    "Mitigasi Risiko",
    "Transfer Risiko",
    "Penghindaran Risiko",
    "Penerimaan Risiko",
  ];

  const strategiPositif = [
    "Eskalasi Risiko",
    "Eksploitasi Risiko",
    "Peningkatan Risiko",
    "Pembagian Risiko",
    "Penerimaan Risiko",
  ];

  const strategiOptions =
    typeOfRisk === "negatif"
      ? strategiNegatif
      : typeOfRisk === "positif"
      ? strategiPositif
      : [];

  const handleSubmit = async () => {
    if (!riskId) return;

    if (!aksiMitigasi || !probabilitas || !dampak || !strategi) {
      setError("Isi semua field yang wajib.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        risk_id: riskId,
        action: aksiMitigasi,
        new_probability: Number(probabilitas),
        new_impact_score: Number(dampak),
        strategy: strategi,
        cost: Number(biaya),
        residual_level: Number(levelResidual),
        target_date: targetWaktu,
        effectiveness: efektivitas,
        action_owner: pemilik,
      };

      const res = await fetch("/api/risk-treatments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menambahkan mitigasi");
      }

      navigate(`/risiko/${riskId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disableInputs = strategi === "" || strategi === "Penerimaan Risiko";

  useEffect(() => {
    if (!probabilitas || !dampak) {
      setLevelResidual("");
      setEfektivitas("");
      return;
    }

    const residual = Number(probabilitas) * Number(dampak);
    setLevelResidual(String(residual));

    if (residual >= 1 && residual <= 7) {
      setEfektivitas("Rendah");
    } else if (residual >= 8 && residual <= 14) {
      setEfektivitas("Sedang");
    } else if (residual >= 15 && residual <= 25) {
      setEfektivitas("Tinggi");
    } else {
      setEfektivitas("");
    }
  }, [probabilitas, dampak]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Tambah Aksi Penanganan
        </h1>
        <p className="text-sm text-gray-500">
          Ikuti langkah di bawah untuk menambahkan aksi penanganan risiko.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-700 mb-5">
          Langkah Aksi Penanganan
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <img
              src="/kelola-risiko/heatmap-risiko.png"
              alt="Heatmap Risiko"
              className="max-w-full rounded-lg shadow-sm"
            />
          </div>

          <div className="order-2 lg:order-1 space-y-4 p-2">
            {/* Strategi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategi ({typeOfRisk || "memuat..."})
              </label>
              <div className="relative w-full">
                <select
                  value={strategi}
                  onChange={(e) => setStrategi(e.target.value)}
                  disabled={strategiOptions.length === 0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none text-gray-800"
                >
                  <option value="" disabled hidden>
                    {strategiOptions.length === 0
                      ? "Memuat strategi..."
                      : "Pilih Strategi"}
                  </option>

                  {strategiOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Aksi Penanganan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aksi Penanganan
              </label>
              <textarea
                placeholder="Cth: downtime > 2 jam..."
                value={aksiMitigasi}
                onChange={(e) => setAksiMitigasi(e.target.value)}
                disabled={disableInputs}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none ${
                  disableInputs
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                rows={3}
              />
            </div>

            {/* Probabilitas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probabilitas
              </label>
              <div className="relative w-full">
                <select
                  value={probabilitas}
                  onChange={(e) => setProbabilitas(e.target.value)}
                  disabled={disableInputs}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none ${
                    disableInputs
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="" disabled hidden>
                    Turunkan Level Probabilitas
                  </option>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Dampak */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dampak
              </label>
              <div className="relative w-full">
                <select
                  value={dampak}
                  onChange={(e) => setDampak(e.target.value)}
                  disabled={disableInputs}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none ${
                    disableInputs
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="" disabled hidden>
                    Turunkan Level Dampak
                  </option>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Level Residual (read only tetap) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level Residual
              </label>
              <input
                type="text"
                value={levelResidual}
                readOnly
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Efektivitas (read only tetap) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Efektivitas
              </label>
              <input
                type="text"
                value={efektivitas}
                readOnly
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Pemilik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pemilik
              </label>
              <input
                type="text"
                value={pemilik}
                onChange={(e) => setPemilik(e.target.value)}
                disabled={disableInputs}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${
                  disableInputs
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                placeholder="Masukkan nama pemilik"
              />
            </div>

            {/* Biaya */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perkiraan Biaya
              </label>
              <input
                type="text"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
                disabled={disableInputs}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${
                  disableInputs
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                placeholder="Cth: 20000"
              />
            </div>

            {/* Target Waktu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Waktu
              </label>
              <input
                type="date"
                value={targetWaktu}
                onChange={(e) => setTargetWaktu(e.target.value)}
                disabled={disableInputs}
                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${
                  disableInputs
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-16">
          <button
            className="w-full lg:w-1/2 border border-gray-300 rounded-lg py-2 text-gray-700"
            onClick={() => navigate(-1)}
          >
            Batal
          </button>
          <button
            className="w-full lg:w-1/2 bg-blue-100 text-blue-700 font-medium py-2 rounded-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Menambahkan..." : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}
