interface RiwayatItem {
  status: string;
  tanggal: string;
  vendor: string;
  catatan: string;
}

interface RiwayatPemeliharaanProps {
  riwayat: RiwayatItem[];
}

export default function RiwayatPemeliharaanCard({
  riwayat,
}: RiwayatPemeliharaanProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-base font-semibold mb-4">Riwayat Pemeliharaan</h2>

      <div className="space-y-5">
        {riwayat.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 -b pb-4 last:border-none last:pb-0"
          >
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <span>✅</span>
              <span>{item.status}</span>
            </div>

            <p className="text-sm text-gray-600">
              {item.tanggal} — oleh{" "}
              <span className="font-medium">{item.vendor}</span>
            </p>

            <p className="text-sm text-gray-700">
              <span className="font-medium">Catatan:</span> {item.catatan}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
