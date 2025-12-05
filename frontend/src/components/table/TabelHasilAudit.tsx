import { useEffect, useState } from "react";
import { Eye, Download, Folder, MessageCircleMore, X, Loader2 } from "lucide-react";
import { fetchWithAuth } from "../../services/api"; // Pastikan path import ini benar
import AuditFile from "../../components/auditor/AuditorFile"; // Modal komentar

// Tipe data sesuai UI
interface AuditFileType {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
  file_url: string;
  file_name: string;
}

interface Props {
  search: string;
  dinas: string;
  periode: { start: string; end: string } | null;
}

export default function TabelHasilAudit({ search, dinas, periode }: Props) {
  const [data, setData] = useState<AuditFileType[]>([]);
  const [filtered, setFiltered] = useState<AuditFileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === MODAL STATES ===
  const [komentarOpen, setKomentarOpen] = useState(false);
  const [selectedKomentar, setSelectedKomentar] = useState<AuditFileType | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<AuditFileType | null>(null);

  // === 1. FETCH DATA (GET /api/audit/reports) ===
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Panggil API
      const response = await fetchWithAuth("/audit/reports");

      // Mapping Data dari Backend ke format UI
      const formattedData: AuditFileType[] = response.map((item: any) => ({
        id: item.id,
        // Improvisasi: Ambil 6 digit awal UUID agar terlihat seperti kode unik
        file_code: item.id.substring(0, 6).toUpperCase(), 
        name: item.title,
        // Note: Jika backend belum kirim nama dinas, kita beri placeholder atau ambil dari user session jika relevan
        dinas: item.department_id, 
        // Format tanggal ke Indonesia
        date: new Date(item.created_at).toLocaleString("id-ID", {
          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        }),
        file_url: item.file_url,
        file_name: item.description || "Dokumen.pdf"
      }));

      setData(formattedData);
      setFiltered(formattedData);
    } catch (err: any) {
      console.error("Gagal ambil data:", err);
      setError(err.message || "Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  // Load data saat komponen pertama kali di-render
  useEffect(() => {
    fetchData();
  }, []);

  // === 2. FILTER LOGIC ===
  useEffect(() => {
    let temp = [...data];

    if (search) {
      const s = search.toLowerCase();
      temp = temp.filter(
        (x) =>
          x.file_code.toLowerCase().includes(s) ||
          x.name.toLowerCase().includes(s) ||
          x.dinas.toLowerCase().includes(s)
      );
    }

    if (dinas && dinas.trim() !== "") {
      temp = temp.filter((x) => x.dinas.toLowerCase() === dinas.toLowerCase());
    }

    if (periode?.start && periode?.end) {
      const start = new Date(periode.start);
      const end = new Date(periode.end);
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);

      temp = temp.filter((x) => {
        // Parse tanggal dari format string locale "dd/mm/yyyy, hh:mm" bisa tricky
        // Lebih aman parsing dari data asli jika disimpan di state terpisah, 
        // tapi untuk simplifikasi kita coba parsing string date.
        // *Disarankan: simpan rawDate di objek state data untuk filtering yg akurat*
        const parts = x.date.split(',')[0].split('/'); // asumsi dd/mm/yyyy
        if(parts.length === 3) {
            const fileDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            return fileDate >= start && fileDate <= end;
        }
        return true;
      });
    }

    setFiltered(temp);
  }, [search, dinas, periode, data]);


  // === 3. ACTIONS ===

  const openKomentar = (item: AuditFileType) => {
    setSelectedKomentar(item);
    setKomentarOpen(true);
  };

  // Submit Komentar ke API (POST /api/audit/findings)
  const handleSubmitKomentar = async (comment: string) => {
    if (!selectedKomentar) return;

    try {
      await fetchWithAuth("/audit/findings", {
        method: "POST",
        body: JSON.stringify({
          entity_type: "report", // Backend harus support ini (Langkah 1)
          entity_id: selectedKomentar.id,
          finding: comment,
          severity: "medium" // Default severity
        })
      });

      alert(`Komentar berhasil dikirim untuk dokumen ${selectedKomentar.name}!`);
      setKomentarOpen(false);
    } catch (err: any) {
      alert(`Gagal mengirim komentar: ${err.message}`);
    }
  };

  const handleDownload = (item: AuditFileType) => {
    if (!item.file_url) return alert("URL file tidak valid.");
    // Buka link di tab baru agar browser men-downloadnya
    window.open(item.file_url, "_blank");
  };

  const openViewer = (item: AuditFileType) => {
    if (item.file_url) {
      setSelectedFile(item);
      setViewerOpen(true);
    } else {
      alert("File tidak tersedia");
    }
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedFile(null);
  };

  // === RENDER ===
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 min-h-[200px]">
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Memuat data laporan...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-10 text-red-500">
            <p>Error: {error}</p>
            <button 
                onClick={fetchData} 
                className="mt-2 text-blue-600 underline hover:text-blue-800"
            >
                Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <p>Tidak ada laporan audit yang ditemukan.</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead className="bg-white border-b border-gray-200 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="py-4 px-6 font-medium">File Dokumen</th>
                  <th className="py-4 px-6 font-medium">Nama Dokumen</th>
                  <th className="py-4 px-6 font-medium">Dinas</th>
                  <th className="py-4 px-6 font-medium">Tanggal & Waktu</th>
                  <th className="py-4 px-6 font-medium text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Folder className="w-4 h-4 text-gray-700" />
                      <span className="text-sm font-mono text-gray-600">{item.file_code}</span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{item.dinas}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{item.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-4">
                        {/* View */}
                        <button 
                            onClick={() => openViewer(item)} 
                            className="p-1 hover:bg-blue-50 rounded-full transition-colors group" 
                            title="Lihat Dokumen"
                        >
                            <Eye className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                        </button>

                        {/* Comment */}
                        <button 
                            onClick={() => openKomentar(item)} 
                            className="p-1 hover:bg-orange-50 rounded-full transition-colors group"
                            title="Beri Komentar"
                        >
                            <MessageCircleMore className="w-5 h-5 text-gray-500 group-hover:text-orange-600" />
                        </button>

                        {/* Download */}
                        <button 
                            onClick={() => handleDownload(item)} 
                            className="p-1 hover:bg-green-50 rounded-full transition-colors group"
                            title="Download"
                        >
                            <Download className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==== MODAL VIEWER ==== */}
      {viewerOpen && selectedFile && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">{selectedFile.name}</h2>
                <button
                  onClick={closeViewer}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex-1 bg-gray-100 p-1 overflow-hidden">
                 <iframe
                    src={selectedFile.file_url}
                    className="w-full h-full rounded-lg border"
                    title={selectedFile.name}
                  />
            </div>
          </div>
        </div>
      )}

      {/* ==== MODAL KOMENTAR ==== */}
      {/* Pastikan komponen AuditFile Anda menerima props yang sesuai */}
      <AuditFile
        isOpen={komentarOpen}
        onClose={() => setKomentarOpen(false)}
        onSubmit={handleSubmitKomentar}
        data={selectedKomentar ? {
            id: selectedKomentar.id,
            file_code: selectedKomentar.file_code,
            name: selectedKomentar.name,
            dinas: selectedKomentar.dinas,
            date: selectedKomentar.date
        } : null}
      />
    </>
  );
}