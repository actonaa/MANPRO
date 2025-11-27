import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import HasilAudit from "../views/auditor/HasilAudit";
import LaporanAsetAuditor from "../views/auditor/LaporanAset";
import LaporanRisikoAuditor from "../views/auditor/LaporanRisiko";
import DetailAsetAuditor from "../views/auditor/DetailAset";
import DetailRisikoAuditor from "../views/auditor/DetailRisiko";
import AuditTrail from "../views/auditor/AuditTrail";
import LaporanPenghapusan from "../views/auditor/LaporanPenghapusan";
import LaporanSDM from "../views/auditor/LaporanSDM";
import LaporanReview from "../views/auditor/LaporanReview";
import LaporanPemeliharaan from "../views/auditor/LaporanPemeliharaan";
import DetailLaporanPenghapusan from "../views/auditor/DetailPenghapusan";
import DetailSdmAuditor from "../views/auditor/detailSDM";

import Callback from "../sso/callback";
import LogoutSSO from "../sso/logout";

import { ProtectedRouteDinas } from "./ProtectedRouteDinas";
import { ProtectedRouteVerifikator } from "./ProtectedRouteVerifikator";
import { ProtectedRouteAuditor } from "./ProtectedRouteAuditor";

import NotFound404 from "../views/Error/NotFound";
import Tambah from "../views/dinas/Aset/Tambah";

import DashboardAdmin from "../views/admin/dashboard";
import EditPengguna from "../views/admin/EditPengguna";
import KelolaPengguna from "../views/admin/KelolaPengguna";
import AsetAdmin from "../views/admin/Aset/KelolaAset";
import PemeliharaanAdmin from "../views/admin/Pemeliharaan/LaporanPemeliharaan";
import { ProtectedRouteAdmin } from "./ProtectedAdmin";
import DetailAsetAdmin from "../views/admin/Aset/DetailAset";
import TambahAdmin from "../views/admin/Aset/Tambah";
import DaftarRisikoAdmin from "../views/admin/Risiko/DaftarRisiko";
import DashboardRisikoAdmin from "../views/admin/Risiko/Dashboard";
import VerifikasiAsetAdminPage from "../views/admin/Aset/VerifikasiAset";
import DataSumberDayaManusia from "../views/admin/SDM/DataSumberDayaManusia";
import LaporanSdmAdmin from "../views/admin/SDM/LaporanSDM";
import LaporanAudit from "../views/admin/Audit/LaporanAudit";
import NotifikasiAdmin from "../views/admin/NotifikasiAdmin";
import EditSDM from "../views/admin/SDM/EditSDM";
import DetailSDM from "../views/admin/SDM/DetailSDM";
import DetailLaporanSDM from "../views/admin/SDM/DetailLaporanSDM";
import TambahPengguna from "../views/admin/TambahPengguna";
import HasilAuditAdmin from "../views/admin/Audit/HasilAuditAdmin";
import VerifikasiPenghapusan from "../views/verifikator/VerifikasiPenghapusan";
import DataSDM from "../views/dinas/Aset/DataSDM";
import LaporanAsetAdmin from "../views/admin/Aset/LaporanAset";
import LaporanRisikoAdmin from "../views/admin/Risiko/LaporanRisiko";

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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aset" element={<KelolaAset />} />
          <Route path="/aset/:id" element={<DetailAset />} />
          <Route path="/aset/tambah" element={<Tambah />} />
          <Route path="/sdm" element={<DataSDM />} />
          <Route path="/laporan/aset" element={<LaporanAset />} />
          <Route path="/risiko" element={<DashboardRisiko />} />
          <Route path="/risiko/data" element={<DaftarRisiko />} />
          <Route path="/risiko/:id" element={<DetailRisiko />} />
          <Route path="/risiko/tambah/:asset_id" element={<RisikoTambah />} />
          <Route path="/risiko/mitigasi/:riskId" element={<TambahMitigasi />} />
          <Route path="/laporan/risiko" element={<LaporanRisiko />} />
          <Route path="/pemeliharaan" element={<JadwalPemeliharaan />} />
          <Route
            path="/pemeliharaan/:id"
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
          <Route path="/aset-penghapusan" element={<VerifikasiPenghapusan />} />
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
            path="/aset-verifikator/:id"
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
          <Route
            path="/notifikasi-verifikator"
            element={<NotificationsVerifikator />}
          />
        </Route>

        {/* Route AUDITOR */}
        <Route element={<ProtectedRouteAuditor />}>
          <Route path="/dashboard-auditor" element={<DashboardAuditor />} />
          <Route path="/audit-auditor" element={<AuditTrail />} />
          <Route path="/hasil-auditor" element={<HasilAudit />} />

          <Route
            path="/laporan/aset-auditor"
            element={<LaporanAsetAuditor />}
          />
          <Route
            path="/laporan/risiko-auditor"
            element={<LaporanRisikoAuditor />}
          />
          <Route
            path="/laporan/aset-auditor/id"
            element={<DetailAsetAuditor />}
          />
          <Route
            path="/laporan/risiko-auditor/id"
            element={<DetailRisikoAuditor />}
          />

          <Route
            path="/laporan/Penghapusan-auditor"
            element={<LaporanPenghapusan />}
          />
          <Route
            path="/laporan/Penghapusan-auditor/id"
            element={<DetailLaporanPenghapusan />}
          />

          <Route
            path="/laporan/Pemeliharaan-auditor"
            element={<LaporanPemeliharaan />}
          />
          <Route path="/laporan/sdm-auditor" element={<LaporanSDM />} />
          <Route
            path="/laporan/sdm-auditor/id"
            element={<DetailSdmAuditor />}
          />
          <Route path="/laporan/riview-auditor" element={<LaporanReview />} />

          <Route
            path="/notifikasi-auditor"
            element={<NotificationsAuditor />}
          />
        </Route>

        <Route element={<ProtectedRouteAdmin />}>
          <Route path="*" element={<NotFound404 />} />
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/editpengguna-admin" element={<EditPengguna />} />
          <Route path="/kelolapengguna-admin" element={<KelolaPengguna />} />
          <Route path="/tambahpengguna-admin" element={<TambahPengguna />} />
          <Route path="/hasilaudit-admin" element={<HasilAuditAdmin />} />
          <Route path="/audit-admin" element={<AuditTrail />} />

          <Route path="/aset-admin" element={<AsetAdmin />} />
          <Route path="/aset-admin/id" element={<DetailAsetAdmin />} />
          <Route
            path="/Verikasi/aset-admin"
            element={<VerifikasiAsetAdminPage />}
          />
          <Route path="/aset-admin/tambah" element={<TambahAdmin />} />
          <Route path="/sdm/aset-admin" element={<DataSumberDayaManusia />} />
          <Route path="/sdm/aset-admin/edit" element={<EditSDM />} />
          <Route path="/sdm/aset-admin/id" element={<DetailSDM />} />

          <Route path="/risiko-admin" element={<DashboardRisikoAdmin />} />
          <Route path="/risiko-admin/daftar" element={<DaftarRisikoAdmin />} />
          <Route path="/risiko-admin/id" element={<DetailRisiko />} />
          <Route path="/risiko-admin/tambah" element={<TambahMitigasi />} />

          <Route path="/laporan/aset-admin" element={<LaporanAsetAdmin />} />
          <Route
            path="/laporan/risiko-admin"
            element={<LaporanRisikoAdmin />}
          />
          <Route path="/laporan/sdm-admin" element={<LaporanSdmAdmin />} />
          <Route path="/laporan/sdm-admin/id" element={<DetailLaporanSDM />} />
          <Route path="/laporan/audit-admin" element={<LaporanAudit />} />
          <Route
            path="/laporan/pemeliharaan-admin"
            element={<PemeliharaanAdmin />}
          />

          <Route
            path="/notifikasi/notifikasi-admin"
            element={<NotifikasiAdmin />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
