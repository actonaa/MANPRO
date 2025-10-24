import LayoutDinas from "../layout/LayoutDinas";
import ButtonFilter from "../../components/button/ButtonFilter";
import TableRisiko from "../../components/table/TableRisiko";
import { useState } from "react";

export default function Risiko() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleStatusChange = (val: string) => setSelectedStatus(val);
  const handleKategoriChange = (val: string) => setSelectedKategori(val);

  return (
    <LayoutDinas>
      {/* Header */}
      <div className="mb-5 px-4 md:px-0">
        <h1 className="text-lg md:text-2xl font-semibold">Daftar Risiko</h1>
        <p className="text-sm text-gray-600 mt-1">
          Kelola dan pantau seluruh risiko aset yang teridentifikasi.
        </p>
      </div>

      <div className="shadow-md bg-white rounded-lg">
        {/* === Desktop Filter + Search === */}
        <div className="hidden md:block bg-white border-b border-[#ddd]">
          <div className="flex justify-between px-6 py-6">
            {/* Search Bar */}
            <div className="w-[240px] md:w-[300px] lg:w-[360px] md:mr-20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID, Nama, Kategori"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              <ButtonFilter
                label="Kategori"
                options={["Aset TI", "Non TI"]}
                onSelect={handleKategoriChange}
              />
              <ButtonFilter
                label="Status"
                options={["Diterima", "Dalam Proses", "Ditolak"]}
                onSelect={handleStatusChange}
              />
            </div>
          </div>
        </div>

        {/* === Mobile Filter + Search === */}
        <div className="block md:hidden border-b border-[#ddd] p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari risiko..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Buttons (stacked vertically) */}
          <div className="flex flex-col sm:flex-row sm:gap-3 gap-2">
            <ButtonFilter
              label="Kategori"
              options={["Aset TI", "Non TI"]}
              onSelect={handleKategoriChange}
            />
            <ButtonFilter
              label="Status"
              options={["Diterima", "Dalam Proses", "Ditolak"]}
              onSelect={handleStatusChange}
            />
          </div>
        </div>

        {/* === Table Risiko === */}
        <div className="px-2 md:px-6">
          <TableRisiko
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            selectedKategori={selectedKategori}
          />
        </div>
      </div>
    </LayoutDinas>
  );
}
