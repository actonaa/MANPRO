export default function LampiranCard() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg  mb-4">Lampiran</h2>

      <div className="flex justify-between gap-6 w-full">
        {/* 📄 Invoice */}
        <div className="flex flex-col items-center justify-center border border-gray-300 rounded-2xl flex-1 h-56 cursor-pointer hover:bg-gray-50 transition">
          <span className="text-4xl mb-2">📄</span>
          <span className="text-gray-800 font-medium">Invoice.pdf</span>
        </div>

        {/* 🖼️ Foto Aset */}
        <div className="flex flex-col items-center justify-center border border-gray-300 rounded-2xl flex-1 h-56 cursor-pointer hover:bg-gray-50 transition">
          <span className="text-4xl mb-2">🖼️</span>
          <span className="text-gray-800 font-medium">FotoAset.jpg</span>
        </div>

        {/* 📁 Garansi */}
        <div className="flex flex-col items-center justify-center border border-gray-300 rounded-2xl flex-1 h-56 cursor-pointer hover:bg-gray-50 transition">
          <span className="text-4xl mb-2">📄</span>
          <span className="text-gray-800 font-medium">Garansi.pdf</span>
        </div>
      </div>
    </div>
  );
}
