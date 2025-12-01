import { Eye } from "lucide-react";

interface AuditFile {
  id: string;
  file_code: string;
  name: string;
  dinas: string;
  date: string;
  file_url?: string;
  file_name?: string;
}

interface Props {
  data: AuditFile;
}

export default function ButtonLihatAudit({ data }: Props) {
  const handleOpenFile = () => {
    if (data.file_url) {
      window.open(data.file_url, "_blank"); // buka file di tab baru
    } else {
      alert("File tidak tersedia");
    }
  };

  return (
    <button
      onClick={handleOpenFile}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <Eye className="w-4 h-4" />
      Lihat
    </button>
  );
}
