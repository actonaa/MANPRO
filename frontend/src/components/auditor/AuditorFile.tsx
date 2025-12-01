import React from "react";

interface AuditFile {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
}

interface AuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  data: AuditFile | null;
}

const AuditorModal: React.FC<AuditorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
}) => {
  const [comment, setComment] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Komentar Auditor</h2>

        {/* INFO FILE AUDIT */}
        {data && (
          <div className="mb-4 text-sm text-gray-600 border p-3 rounded-md">
            <p>
              <b>ID File:</b> {data.id}
            </p>
            <p>
              <b>Nama File:</b> {data.name}
            </p>
            <p>
              <b>Kode File:</b> {data.file_code}
            </p>
            <p>
              <b>Dinas:</b> {data.dinas}
            </p>
            <p>
              <b>Tanggal:</b> {data.date}
            </p>
          </div>
        )}

        {/* TEXTAREA */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Berikan komentar Anda..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Batal
          </button>

          <button
            onClick={() => {
              onSubmit(comment);
              setComment(""); // Reset comment setelah submit
            }}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Kirim Komentar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditorModal;
