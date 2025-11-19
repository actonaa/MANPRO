import { useState } from "react";
import { Eye, Trash2, Edit } from "lucide-react";

interface Pengguna {
  nama: string;
  email: string;
  peran: string;
  dinas: string;
  status: string;
  terakhirAktif: string;
}

interface KelolaPenggunaTableProps {
  filters?: {
    dinas: string;
    peran: string;
    status: string;
    search?: string; // ⭐ Tambah untuk search
  };
  onDelete?: (nama: string, email: string) => void;
  onView?: (user: Pengguna) => void;
  onEdit?: (user: Pengguna) => void;
}

export default function KelolaPenggunaTable({
  filters,
  onDelete,
  onView,
  onEdit,
}: KelolaPenggunaTableProps) {
  const [data] = useState<Pengguna[]>([
    {
      nama: "Rajendra Wahyu",
      email: "rajendra@gmail.com",
      peran: "User Dinas",
      dinas: "Dinas Pariwisata",
      status: "Aktif",
      terakhirAktif: "15 Oktober 2025, 14:30",
    },
    {
      nama: "Diyan Rahma",
      email: "diyan@gmail.com",
      peran: "Verifikator",
      dinas: "Dinas Pariwisata",
      status: "Non-Aktif",
      terakhirAktif: "4 Hari yang lalu",
    },
    {
      nama: "Budiono Siregar",
      email: "budiono@gmail.com",
      peran: "Administrator",
      dinas: "Dinas Komunikasi",
      status: "Aktif",
      terakhirAktif: "3 Jam yang lalu",
    },
    {
      nama: "Agus Wijaya",
      email: "agus@gmail.com",
      peran: "Auditor",
      dinas: "Global",
      status: "Aktif",
      terakhirAktif: "5 Jam yang lalu",
    },
  ]);

  // SEARCH + FILTER
  const filteredData = data.filter((item) => {
    const s = filters?.search?.toLowerCase() || "";

    const matchSearch =
      item.nama.toLowerCase().includes(s) ||
      item.email.toLowerCase().includes(s) ||
      item.dinas.toLowerCase().includes(s);

    return (
      matchSearch &&
      (!filters?.dinas || item.dinas === filters.dinas) &&
      (!filters?.peran || item.peran === filters.peran) &&
      (!filters?.status || item.status === filters.status)
    );
  });

  const getPeranColor = (peran: string) => {
    switch (peran) {
      case "User Dinas":
        return "bg-green-100 text-green-700";
      case "Verifikator":
        return "bg-yellow-100 text-yellow-700";
      case "Administrator":
        return "bg-blue-100 text-blue-700";
      case "Auditor":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Aktif"
      ? "text-green-600 before:bg-green-500"
      : "text-red-600 before:bg-red-500";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
      <table className="min-w-full border-collapse w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-200 uppercase">
            <th className="py-3 px-4 font-semibold tracking-wide">NAMA</th>
            <th className="py-3 px-4 font-semibold tracking-wide">EMAIL</th>
            <th className="py-3 px-4 font-semibold tracking-wide">PERAN</th>
            <th className="py-3 px-4 font-semibold tracking-wide">DINAS</th>
            <th className="py-3 px-4 font-semibold tracking-wide">STATUS</th>
            <th className="py-3 px-4 font-semibold tracking-wide">
              TERAKHIR AKTIF
            </th>
            <th className="py-3 px-4 font-semibold tracking-wide text-center">
              AKSI
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((user, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-gray-900 text-sm font-medium"
              >
                <td className="py-3 px-4">{user.nama}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPeranColor(
                      user.peran
                    )}`}
                  >
                    {user.peran}
                  </span>
                </td>
                <td className="py-3 px-4">{user.dinas}</td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-2 before:content-[''] before:block before:w-2 before:h-2 before:rounded-full ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {user.terakhirAktif}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => onView && onView(user)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit && onEdit(user)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => onDelete && onDelete(user.nama, user.email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                Tidak ada data yang sesuai dengan filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
