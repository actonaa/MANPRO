import { useState, useMemo } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import ButtonFilter from "../../components/button/ButtonFilter";
import KelolaPenggunaTable from "../../components/table/TabelKelolaPengguna";
import PopupHapusPengguna from "../../components/form/Admin/HapusPengguna";
import PopupDetailPengguna from "../../components/form/Admin/DetailPengguna";
import { useNavigate } from "react-router-dom";

export default function KelolaPengguna() {
  const [filters, setFilters] = useState({
    dinas: "",
    peran: "",
    status: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    nama: string;
    email: string;
  } | null>(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  // 🔹 Handler filter
  const handleFilterChange = (key: string, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  // 🔹 Dummy Data
  const data = [
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
      dinas: "Dinas Pendidikan",
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
  ];

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (!filters.dinas || item.dinas === filters.dinas) &&
        (!filters.peran || item.peran === filters.peran) &&
        (!filters.status || item.status === filters.status)
    );
  }, [filters]);

  // 🔹 Klik hapus
  const handleDeleteClick = (nama: string, email: string) => {
    setSelectedUser({ nama, email });
    setShowPopup(true);
  };

  // 🔹 Konfirmasi hapus
  const handleConfirmDelete = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

  // 🔹 Klik detail 👁️
  const handleViewClick = (user: any) => {
    setSelectedDetail({
      ...user,
      idPengguna: "09072004",
      terakhirDiubah: "10 Oktober 2025, 09:15",
      tanggalDibuat: "12 Agustus 2023, 10:00",
    });
    setShowDetail(true);
  };

  const handleEditClick = (user: any) => {
    navigate("edit-pengguna", { state: user });
  };

  // di dalam komponen KelolaPengguna()
  const navigate = useNavigate();

  return (
    <div className="px-3 sm:px-4 py-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div>
          <h1 className="font-semibold text-[20px] sm:text-[22px] md:text-2xl lg:text-[28px] text-gray-800 mb-1">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-gray-500">
            Pantau dan kelola seluruh pengguna yang terdaftar.
          </p>
        </div>
        <button
          onClick={() => navigate("tambah-pengguna")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-2 sm:px-4 py-2 rounded-lg text-sm transition"
        >
          + Tambah
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 sm:mb-6 w-full">
        <div className="p-4 sm:p-5 w-full">
          <div className="flex flex-wrap gap-3 sm:gap-4 w-full">
            <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
              <ButtonFilter
                label="Pilih Dinas"
                options={[
                  "Dinas Pariwisata",
                  "Dinas Pendidikan",
                  "Dinas Komunikasi",
                  "Global",
                ]}
                onSelect={(val) => handleFilterChange("dinas", val)}
              />
            </div>
            <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
              <ButtonFilter
                label="Pilih Peran"
                options={[
                  "User Dinas",
                  "Verifikator",
                  "Administrator",
                  "Auditor",
                ]}
                onSelect={(val) => handleFilterChange("peran", val)}
              />
            </div>
            <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
              <ButtonFilter
                label="Pilih Status"
                options={["Aktif", "Non-Aktif"]}
                onSelect={(val) => handleFilterChange("status", val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-3 sm:space-y-4">
        {filteredData.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.peran === "User Dinas"
                      ? "bg-green-100 text-green-700"
                      : user.peran === "Verifikator"
                      ? "bg-yellow-100 text-yellow-700"
                      : user.peran === "Administrator"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.peran}
                </span>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    user.status === "Aktif" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.status === "Aktif" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {user.status}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {user.terakhirAktif}
              </span>
            </div>

            <h2 className="font-semibold text-gray-800 text-[15px] sm:text-lg">
              {user.nama}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>

            <div className="mt-1 sm:mt-2">
              <p className="text-sm text-gray-800 font-medium">
                {user.dinas.toUpperCase()}
              </p>
            </div>

            <div className="flex justify-end gap-3 sm:gap-4 mt-2 sm:mt-3">
              <button
                onClick={() => handleViewClick(user)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEditClick(user)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeleteClick(user.nama, user.email)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <KelolaPenggunaTable
          filters={filters}
          onDelete={(nama, email) => handleDeleteClick(nama, email)}
          onView={(user) => handleViewClick(user)} // ✅ Tambahkan ini
          onEdit={(user) => navigate("edit-pengguna", { state: user })} // ✅ Tambahkan ini
        />
      </div>

      {/* Popup Hapus */}
      {showPopup && selectedUser && (
        <PopupHapusPengguna
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmDelete}
          nama={selectedUser.nama}
          email={selectedUser.email}
        />
      )}

      {/* Popup Detail */}
      {showDetail && selectedDetail && (
        <PopupDetailPengguna
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          pengguna={selectedDetail}
        />
      )}
    </div>
  );
}
