// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/dinas/Dashboard";
import KelolaAset from "../views/dinas/KelolaAset";
import AsetTambah from "../views/dinas/Aset/Tambah";
import RisikoTambah from "../views/dinas/Risiko/From";
import DashboardRisiko from "../views/dinas/KelolaRisiko";
import DetailAset from "../views/dinas/Detail";
import Notifications from "../views/dinas/Notifications";
import DaftarRisiko from "../views/dinas/DaftarRisiko";
import Pemeliharaan from "../views/dinas/LaporanPemeliharaan";
import JadwalPemeliharaan from "../views/dinas/JadwalPemeliharaan";
import LaporanAset from "../views/dinas/LaporanAset";
import DetailLaporanPemeliharaan from "../views/dinas/DetailLaporanPemeliharaan";
import DetailRisiko from "../views/dinas/DetailRisiko";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aset" element={<KelolaAset />} />
        <Route path="/aset/tambah" element={<AsetTambah />} />
        <Route path="/risiko/tambah" element={<RisikoTambah />} />
        <Route path="/dashboard/risiko" element={<DashboardRisiko />} />
        <Route path="/aset/id" element={<DetailAset />} />
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/daftar/risiko" element={<DaftarRisiko/>}/>
        <Route path="/laporan/pemeliharaan" element={<Pemeliharaan/>}/>
        <Route path="/jadwal/pemeliharaan" element={<JadwalPemeliharaan/>}/>
        <Route path="/laporan/aset" element={<LaporanAset/>}/>
        <Route path="/detail/laporan" element={<DetailLaporanPemeliharaan/>}/>
        <Route path="/detail/risiko" element={<DetailRisiko/>}/>
        
      </Routes>
    </Router>
  );
}
