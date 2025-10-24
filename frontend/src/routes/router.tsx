import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/dinas/Dashboard";
import KelolaAset from "../views/dinas/Aset/KelolaAset";
import AsetTambah from "../views/dinas/Aset/Tambah";
import DetailAset from "../views/dinas/Aset/DetailAset";
import LaporanAset from "../views/dinas/Aset/LaporanAset";
import RisikoTambah from "../views/dinas/Risiko/From";
import DashboardRisiko from "../views/dinas/Risiko/KelolaRisiko";
import DetailRisiko from "../views/dinas/Risiko/DetailRisiko";
import DaftarRisiko from "../views/dinas/Risiko/DaftarRisiko";
import LaporanRisiko from "../views/dinas/Risiko/LaporanRisiko";
import TambahMitigasi from "../views/dinas/Risiko/TambahMitigasi";
import Pemeliharaan from "../views/dinas/Pemeliharaan/LaporanPemeliharaan";
import JadwalPemeliharaan from "../views/dinas/Pemeliharaan/JadwalPemeliharaan";
import DetailLaporanPemeliharaan from "../views/dinas/Pemeliharaan/DetailLaporanPemeliharaan";
import DetailJadwalPemeliharaan from "../views/dinas/Pemeliharaan/DetailJadwalPemeliharaan";
import Notifications from "../views/dinas/Notifications";

import Callback from "../sso/callback";
import LogoutSSO from "../sso/logout";
import { ProtectedRoute } from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* route publik */}
        <Route path="/sso/callback" element={<Callback />} />
        <Route path="/sso/logout" element={<LogoutSSO />} />

        {/* semua route berikut diproteksi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aset" element={<KelolaAset />} />
          <Route path="/aset/:id" element={<DetailAset />} />
          <Route path="/aset/tambah" element={<AsetTambah />} />
          <Route path="/aset/laporan" element={<LaporanAset />} />
          <Route path="/dashboard/risiko" element={<DashboardRisiko />} />
          <Route path="/risiko" element={<DaftarRisiko />} />
          <Route path="/risiko/:id" element={<DetailRisiko />} />
          <Route path="/risiko/tambah" element={<RisikoTambah />} />
          <Route path="/risiko/laporan" element={<LaporanRisiko />} />
          <Route path="/risiko/tambah/mitigasi" element={<TambahMitigasi />} />
          <Route path="/pemeliharaan" element={<JadwalPemeliharaan />} />
          <Route
            path="/pemeliharaan/detail/jadwal"
            element={<DetailJadwalPemeliharaan />}
          />
          <Route path="/pemeliharaan/laporan" element={<Pemeliharaan />} />
          <Route
            path="/detail/laporan"
            element={<DetailLaporanPemeliharaan />}
          />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
}
