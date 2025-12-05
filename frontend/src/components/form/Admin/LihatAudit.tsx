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
  isOpen: boolean;
  onClose: () => void;
  data: AuditFile | null;
}

export default function ButtonLihatAudit({ data }: Props) {
  if (!data) return null;

  const handleOpenFile = () => {
    if (data.file_url) {
      window.open(data.file_url, "_blank");
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
