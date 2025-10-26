import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "../views/dinas/Dashboard";
import KelolaAset from "../views/dinas/Aset/KelolaAset";
import AsetTambah from "../views/dinas/Aset/Tambah";
import DetailAset from "../views/dinas/Aset/DetailAset";
import LaporanAset from "../views/dinas/Aset/LaporanAset";

import DashboardRisiko from "../views/dinas/Risiko/KelolaRisiko";
import DaftarRisiko from "../views/dinas/Risiko/DaftarRisiko";
import DetailRisiko from "../views/dinas/Risiko/DetailRisiko";
import RisikoTambah from "../views/dinas/Risiko/From";
import TambahMitigasi from "../views/dinas/Risiko/TambahMitigasi";
import LaporanRisiko from "../views/dinas/Risiko/LaporanRisiko";

import Pemeliharaan from "../views/dinas/Pemeliharaan/LaporanPemeliharaan";
import JadwalPemeliharaan from "../views/dinas/Pemeliharaan/JadwalPemeliharaan";
import DetailLaporanPemeliharaan from "../views/dinas/Pemeliharaan/DetailLaporanPemeliharaan";
import DetailJadwalPemeliharaan from "../views/dinas/Pemeliharaan/DetailJadwalPemeliharaan";

import Notifications from "../views/dinas/Notifications";

import DashboardVerifikator from "../views/verifikator/Dashboard";
import RisikoVerifikator from "../views/verifikator/DaftarRisiko";
import JadwalPemeliharaanVerifikator from "../views/verifikator/JadwalPemeliharaan";
import LaporanAsetVerifikator from "../views/verifikator/LaporanAset";

import Callback from "../sso/callback";
import LogoutSSO from "../sso/logout";

import { ProtectedRouteDinas } from "./ProtectedRouteDinas";
import { ProtectedRouteVerifikator } from "./ProtectedRouteVerifikator";

import NotFound404 from "../views/Error/NotFound";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Route publik */}
        <Route path="/sso/callback" element={<Callback />} />
        <Route path="/sso/logout" element={<LogoutSSO />} />
        <Route path="/unauthorized" element={<h1>Akses Ditolak</h1>} />

        {/* Route dinas */}
        <Route element={<ProtectedRouteDinas />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aset" element={<KelolaAset />} />
          <Route path="/aset/:id" element={<DetailAset />} />
          <Route path="/aset/tambah" element={<AsetTambah />} />
          <Route path="/laporan/aset" element={<LaporanAset />} />
          <Route path="/risiko" element={<DashboardRisiko />} />
          <Route path="/risiko/data" element={<DaftarRisiko />} />
          <Route path="/risiko/:id" element={<DetailRisiko />} />
          <Route path="/risiko/tambah" element={<RisikoTambah />} />
          <Route path="/risiko/mitigasi" element={<TambahMitigasi />} />
          <Route path="/laporan/risiko" element={<LaporanRisiko />} />
          <Route path="/pemeliharaan" element={<JadwalPemeliharaan />} />
          <Route
            path="/pemeliharaan/detail"
            element={<DetailJadwalPemeliharaan />}
          />
          <Route path="/laporan/pemeliharaan" element={<Pemeliharaan />} />
          <Route
            path="/laporan/pemeliharaan/detail"
            element={<DetailLaporanPemeliharaan />}
          />
          <Route path="/notifikasi" element={<Notifications />} />
        </Route>

        {/* Route verifikator */}
        <Route element={<ProtectedRouteVerifikator />}>
          <Route
            path="/dashboard-verifikator"
            element={<DashboardVerifikator />}
          />
          <Route path="/aset/laporan-verifikator" element={<LaporanAsetVerifikator />} />
          <Route path="/risiko-verifikator" element={<RisikoVerifikator />} />
          <Route path="/jadwal-verifikator" element={<JadwalPemeliharaanVerifikator />} />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
}
