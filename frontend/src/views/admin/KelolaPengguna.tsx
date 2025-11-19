import { useState, useMemo } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import ButtonFilter from "../../components/button/ButtonFilter";
import KelolaPenggunaTable from "../../components/table/TabelKelolaPengguna";
import PopupHapusPengguna from "../../components/form/Admin/HapusPengguna";
import PopupDetailPengguna from "../../components/form/Admin/DetailPengguna";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/filter/Search";

export default function KelolaPengguna() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    dinas: "",
    peran: "",
    status: "",
    search: "", // ⭐ Search ditambahkan ke state
  });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const handleFilterChange = (key: string, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

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

  // ⭐ Tambahkan search filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const s = filters.search.toLowerCase();

      const matchSearch =
        item.nama.toLowerCase().includes(s) ||
        item.email.toLowerCase().includes(s) ||
        item.dinas.toLowerCase().includes(s);

      return (
        matchSearch &&
        (!filters.dinas || item.dinas === filters.dinas) &&
        (!filters.peran || item.peran === filters.peran) &&
        (!filters.status || item.status === filters.status)
      );
    });
  }, [filters]);

  const handleDeleteClick = (nama: string, email: string) => {
    setSelectedUser({ nama, email });
    setShowPopup(true);
  };

  const handleConfirmDelete = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

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
    navigate("/editpengguna-admin", { state: user });
  };

  return (
    <div className="px-3 sm:px-4 py-4 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-semibold text-[22px] md:text-2xl text-gray-800 mb-1">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-gray-500">
            Pantau dan kelola seluruh pengguna yang terdaftar.
          </p>
        </div>

        <button
          onClick={() => navigate("/tambahpengguna-admin")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Tambah
        </button>
      </div>

      {/* ⭐ FILTER CARD + SEARCH BAR */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-4 flex flex-col gap-4">
          {/* 🔍 SEARCH BAR — NEW */}
          <div className="w-full md:w-1/2">
            <SearchBar
              placeholder="Cari nama, email, atau dinas..."
              onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
            />
          </div>

          {/* FILTER DROPDOWN */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <ButtonFilter
                label="Pilih Dinas"
                options={[
                  "Dinas Pariwisata",
                  "Dinas Pendidikan",
                  "Dinas Komunikasi",
                ]}
                onSelect={(val) => handleFilterChange("dinas", val)}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
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

            <div className="flex-1 min-w-[200px]">
              <ButtonFilter
                label="Pilih Status"
                options={["Aktif", "Non-Aktif"]}
                onSelect={(val) => handleFilterChange("status", val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block md:hidden space-y-4">
        {filteredData.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
          >
            <div className="flex justify-between mb-2">
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
                  className={`text-sm font-medium ${
                    user.status === "Aktif" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ● {user.status}
                </span>
              </div>

              <span className="text-xs text-gray-500">
                {user.terakhirAktif}
              </span>
            </div>

            <h2 className="font-semibold text-gray-800">{user.nama}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>

            <p className="mt-2 text-sm font-medium text-gray-700">
              {user.dinas.toUpperCase()}
            </p>

            <div className="flex justify-end gap-4 mt-3">
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

      {/* DESKTOP */}
      <div className="hidden md:block">
        <KelolaPenggunaTable
          filters={filters}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          onEdit={(user) => navigate("/editpengguna-admin", { state: user })}
        />
      </div>

      {/* POPUPS */}
      {showPopup && selectedUser && (
        <PopupHapusPengguna
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmDelete}
          nama={selectedUser.nama}
          email={selectedUser.email}
        />
      )}

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
