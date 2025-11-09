import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "../views/dinas/Dashboard";
import KelolaAset from "../views/dinas/Aset/KelolaAset";
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
import NotificationsVerifikator from "../views/dinas/Notifications";
import NotificationsAuditor from "../views/dinas/Notifications";

import DashboardVerifikator from "../views/verifikator/Dashboard";
import RisikoVerifikator from "../views/verifikator/DaftarRisiko";
import JadwalPemeliharaanVerifikator from "../views/verifikator/JadwalPemeliharaan";
import LaporanAsetVerifikator from "../views/verifikator/LaporanAset";
import VerifikatorAset from "../views/verifikator/VerifikasiAset";
import DetailAsetVerifikator from "../views/verifikator/DetailAset";
import LaporanRisikoVerifikator from "../views/verifikator/LaporanRisiko";
import DetailRisikoVerifikator from "../views/verifikator/DetailRisiko";
import LaporanPemeliharaanVerifikator from "../views/verifikator/LaporanPemeliharaan";
import DetailPemeliharaanVerifikator from "../views/verifikator/DetailLaporanPemeliharaan";
import DetailJadwalVerifikator from "../views/verifikator/DetailJadwalPemeliharaan";

import DashboardAuditor from "../views/auditor/dashboard";
import AuditorAset from "../views/auditor/KelolaAset";
import LaporanAsetAuditor from "../views/auditor/LaporanAset";
import RisikoAuditor from "../views/auditor/Risiko";
import LaporanRisikoAuditor from "../views/auditor/LaporanRisiko";
import DetailAsetAuditor from "../views/auditor/DetailAset";
import DetailRisikoAuditor from "../views/auditor/DetailRisiko";

import Callback from "../sso/callback";
import LogoutSSO from "../sso/logout";

import { ProtectedRouteDinas } from "./ProtectedRouteDinas";
import { ProtectedRouteVerifikator } from "./ProtectedRouteVerifikator";
import { ProtectedRouteAuditor } from "./ProtectedRouteAuditor";

import NotFound404 from "../views/Error/NotFound";
import Tambah from "../views/dinas/Aset/Tambah";

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
          <Route path="/aset-verifikator" element={<VerifikatorAset />} />
          <Route
            path="/laporan/aset-verifikator"
            element={<LaporanAsetVerifikator />}
          />
          <Route path="/risiko-verifikator" element={<RisikoVerifikator />} />
          <Route
            path="/laporan/risiko-verifikator"
            element={<LaporanRisikoVerifikator />}
          />
          <Route
            path="/jadwal-verifikator"
            element={<JadwalPemeliharaanVerifikator />}
          />
          <Route
            path="/pemeliharaan-verifikator"
            element={<LaporanPemeliharaanVerifikator />}
          />
          <Route
            path="/aset-verifikator/detail"
            element={<DetailAsetVerifikator />}
          />
          <Route
            path="/risiko-verifikator/detail"
            element={<DetailRisikoVerifikator />}
          />
          <Route
            path="/pemeliharaan-verifikator/detail"
            element={<DetailPemeliharaanVerifikator />}
          />
          <Route
            path="/jadwal-verifikator/detail"
            element={<DetailJadwalVerifikator />}
          />
          <Route path="/notifikasi-verifikator" element={<NotificationsVerifikator />} />
        </Route>

         {/* Route AUDITOR */}
         <Route element={<ProtectedRouteAuditor />}>
          <Route path="/dashboard-auditor" element={<DashboardAuditor />} />
          <Route path="/aset-auditor" element={<AuditorAset />} />
          <Route
            path="/laporan/aset-auditor"
            element={<LaporanAsetAuditor />}
          />
          <Route path="/risiko-auditor" element={<RisikoAuditor />} />
          <Route
            path="/laporan/risiko-auditor"
            element={<LaporanRisikoAuditor />}
          />
          <Route path="/aset-auditor/detail" element={<DetailAsetAuditor />} />
          <Route
            path="/risiko-auditor/detail"
            element={<DetailRisikoAuditor />}
          />
          <Route
            path="/aset-auditor/detail"
            element={<DetailAsetAuditor />}
          />
          <Route
            path="/notifikasi-auditor"
            element={<NotificationsAuditor />}
          />
        </Route>
        <Route path="*" element={<NotFound404 />} />
        <Route path="/tambah" element={<Tambah />} />
      </Routes>
    </Router>
  );
}
